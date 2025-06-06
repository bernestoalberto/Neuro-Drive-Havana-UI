import {
  HttpClient,
  HttpDownloadProgressEvent,
  HttpEvent,
  HttpEventType,
  HttpHeaders,
  httpResource,
  HttpResponse,
} from '@angular/common/http';
import {
  Injectable,
  Injector,
  inject,
  signal,
  resource,
  Signal,
} from '@angular/core';
import {
  Observable,
  Subject,
  filter,
  map,
  startWith,
  firstValueFrom,
} from 'rxjs';
import { AI_NAME } from './shared/helper';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { Auth, idToken } from '@angular/fire/auth';
import { OSType } from './project-const';

type ModelAnswer = {
  parts: any;
};
export interface Message {
  id: string;
  text: string;
  fromUser: boolean;
  generating?: boolean;
}
export interface Post {
  id?: string;
  title: string;
  content: string;
}
@Injectable({
  providedIn: 'root',
})
export class AppService {
  private readonly http = inject(HttpClient);
  injector = inject(Injector);
  private auth = inject(Auth);
  error = new Subject<string>();
  private readonly _completeMessages = signal<Message[]>([]);
  private readonly _messages = signal<Message[]>([]);
  private readonly _generatingInProgress = signal<boolean>(false);
  private _snackBar = inject(MatSnackBar);
  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  durationInSeconds = 5;
  readonly messages = this._messages.asReadonly();
  readonly generatingInProgress = this._generatingInProgress.asReadonly();

  sendMessage(prompt: string): void {
    this._generatingInProgress.set(true);

    this._completeMessages.set([
      ...this._completeMessages(),
      {
        id: window.crypto.randomUUID(),
        text: prompt,
        fromUser: true,
      },
    ]);

    this.getChatResponseStream(prompt).subscribe({
      next: (message) =>
        this._messages.set([...this._completeMessages(), message]),

      complete: () => {
        this._completeMessages.set(this._messages());
        this._generatingInProgress.set(false);
      },

      error: () => this._generatingInProgress.set(false),
    });
  }

  private getChatResponseStream(prompt: string): Observable<Message> {
    const id = window.crypto.randomUUID();
    const serverUrl = 'http://localhost:3000/message';

    return this.http
      .post(serverUrl, prompt, {
        responseType: 'text',
        observe: 'events',
        reportProgress: true,
      })
      .pipe(
        filter(
          (event: HttpEvent<string>): boolean =>
            event.type === HttpEventType.DownloadProgress ||
            event.type === HttpEventType.Response
        ),
        map(
          (event: HttpEvent<string>): Message =>
            event.type === HttpEventType.DownloadProgress
              ? {
                  id,
                  text: (event as HttpDownloadProgressEvent).partialText!,
                  fromUser: false,
                  generating: true,
                }
              : {
                  id,
                  text: (event as HttpResponse<string>).body!,
                  fromUser: false,
                  generating: false,
                }
        ),
        startWith<Message>({
          id,
          text: '',
          fromUser: false,
          generating: true,
        })
      );
  }

  createImage(
    history: string,
    model: string,
    message: string,
    typeOfAI: string
  ): Observable<any> {
    const localToken = localStorage.getItem('userData');
    const token = localToken ? JSON.parse(localToken) : idToken(this.auth);
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const body = JSON.stringify({
      idToken: token._token,
      query: {
        history,
        message,
        model,
        typeOfAI,
      },
    });

    const url = `http://${window.location.hostname}:8000/photos/generate`;
    // return httpResource<any>({ url, body }, { injector: this.injector });
    return this.http.post(url, body, { headers });
  }
  uploadImage(
    formData: FormData,
    history: any[],
    message: string,
    model: string = 'gemini-1.5-flash',
    typeOfAI: string = AI_NAME.GEMINI
  ): Observable<any> {
    const url = `http://${window.location.hostname}:8000/photos/upload`;
    const localToken = localStorage.getItem('userData');
    const token = localToken ? JSON.parse(localToken) : idToken(this.auth);
    const body = JSON.stringify({
      idToken: token._token,
      history,
      message,
      model,
      typeOfAI,
    });
    formData.append('query', body);
    return this.http.post(url, formData, {
      reportProgress: true,
    });
  }

  /**
   * Fetches a response from the server based on the provided parameters
   * @param history Conversation history
   * @param message User message
   * @param typeOfAI AI type, defaults to GEMINI
   * @param model Model name, defaults to gemini-1.5-flash
   */
  getResponse(
    // Todo: Integrate http resource

    history: any[],
    message: string,
    typeOfAI: string = AI_NAME.GEMINI,
    model: string | { model: string; options: string } = 'gemini-2.5-flash'
  ): Observable<any> {
    const options = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const localToken = localStorage.getItem('userData');
    const token = localToken ? JSON.parse(localToken) : idToken(this.auth);

    // Handle model parameter which can be a string or an object with options
    let modelValue: string;
    let modelOptions: any = null;

    if (typeof model === 'string') {
      modelValue = model;
    } else {
      modelValue = model.model;
      modelOptions = model.options;
    }

    const body = JSON.stringify({
      idToken: token._token,
      query: {
        history,
        message,
        model: modelValue,
        modelOptions,
        typeOfAI,
      },
    });
    const url = this.getUrlBasedOnModel(typeOfAI);

    return this.http.post(url, body, options);
  }

  /**
   * Creates a resource API function to handle message responses using Angular's resource API
   * @param history Conversation history
   * @param message User message
   * @param typeOfAI AI type, defaults to GEMINI
   * @param model Model name, defaults to gemini-1.5-flash
   */
  getResponseHttpResourceApi(
    history: any[],
    message: string,
    typeOfAI: string = AI_NAME.GEMINI,
    model: string | { model: string; options: string } = 'gemini-1.5-flash'
  ) {
    const auth = inject(Auth);
    const http = inject(HttpClient);
    const localToken = localStorage.getItem('userData');
    const token = localToken ? JSON.parse(localToken) : idToken(auth);
    const url = this.getUrlBasedOnModel(typeOfAI);

    // Handle model parameter which can be a string or an object with options
    let modelValue: string;
    let modelOptions: any = null;

    if (typeof model === 'string') {
      modelValue = model;
    } else {
      modelValue = model.model;
      modelOptions = model.options;
    }

    const requestBody = {
      idToken: token._token,
      query: {
        history,
        message,
        model: modelValue,
        modelOptions,
        typeOfAI,
      },
    };

    const requestOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    // Create a resource with a proper loader function
    return resource<any, undefined>({
      loader() {
        return firstValueFrom(http.post(url, requestBody, requestOptions));
      },
    });
  }

  streamChatRespone(
    history: any[],
    message: string,
    typeOfAI: string = AI_NAME.GEMINI,
    model: string | { model: string; options: string } = 'gemini-2.5-flash',
    data: Signal<{ value: string } | { error: unknown }>
  ) {
    const url = this.getUrlBasedOnModel(typeOfAI);

    fetch(url).then(async (response) => {
      if (!response.body) return;

      for await (const chunk of response.body) {
        const chunkText = this.decoder.decode(chunk);
        data.update((prev: { value: string } | { error: unknown }) => {
          if ('value' in prev) {
            return { value: `${prev.value} ${chunkText}` };
          } else {
            return { error: chunkText };
          }
        });
      }
    });
    return data;
  }

  getUrlBasedOnModel(typeOfAI: string): string {
    let url = `http://${window.location.hostname}:8000/gemini`;
    if (typeOfAI.toLowerCase().includes(AI_NAME.OPENAI.toLowerCase())) {
      url = `http://${window.location.hostname}:8000/openai`;
    }
    if (typeOfAI.toLowerCase().includes(AI_NAME.LLAMA.toLowerCase())) {
      url = this.getOS().includes(OSType.Windows)
        ? `http://192.168.137.2:8000/llama`
        : `http://${window.location.hostname}:8000/llama`;
    }
    if (typeOfAI.toLowerCase().includes(AI_NAME.DEEPSEEK.toLowerCase())) {
      url = this.getOS().includes(OSType.Windows)
        ? `http://192.168.137.2:8000/search`
        : `http://${window.location.hostname}:8000/search`;
    }
    return url;
  }
  getOS(): string {
    if ((navigator as any).userAgentData?.platform) {
      return (navigator as any).userAgentData.platform;
    } else {
      const userAgent = navigator.userAgent;
      if (userAgent.indexOf(OSType.Windows) !== -1) return OSType.Windows;
      if (userAgent.indexOf(OSType.MacOS) !== -1) return OSType.MacOS;
      if (userAgent.indexOf(OSType.Linux) !== -1) return OSType.Linux;
      if (userAgent.indexOf(OSType.Android) !== -1) return OSType.Android;
      if (userAgent.indexOf(OSType.iOS) !== -1) return OSType.iOS;
      return OSType.Unknown;
    }
  }

  onCreateFirebasePost(postData: { title: string; content: string }) {
    const url = 'https://appconex-d8cb0-default-rtdb.firebaseio.com/posts.json';
    this.http
      .post<{ name: string }>(url, postData)
      .subscribe((responseData: any) => {});
  }
  onFetchFirebasePost(): Observable<Post[]> {
    const url = 'https://appconex-d8cb0-default-rtdb.firebaseio.com/posts.json';
    return this.http.get<{ [key: string]: Post[] }>(url).pipe(
      map((responseData: any) => {
        // Todo: {[key: string]: Post }
        const postArray: Post[] = [];
        for (const key in responseData) {
          if (responseData.hasOwnProperty(key)) {
            postArray.push({ ...responseData[key], id: key });
          }
        }
        return postArray;
      })
    );
  }
  onDeleteFirebasePost(id: string) {
    const url = `https://appconex-d8cb0-default-rtdb.firebaseio.com/posts/${id}.json`;
    return this.http.delete(url);
  }

  getAnswers() {
    return [{ prompt: '', answer: '' }];
  }
  fetchAnswers() {
    return [{ prompt: '', answer: '' }];
  }
  openSnackBar(
    text: string = 'Please enter a question',
    action: string = 'error',
    duration: number = 5
  ) {
    this._snackBar.open(text, action ?? 'close', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: duration ?? this.durationInSeconds * 1000,
    });
  }
}
function experimental(
  target: AppService,
  propertyKey: 'streamChatRespone',
  descriptor: TypedPropertyDescriptor<
    (
      history: any[],
      message: string,
      typeOfAI: string | undefined,
      model: string | { model: string; options: string } | undefined,
      data: Signal<{ value: string } | { error: unknown }>
    ) => void
  >
): void | TypedPropertyDescriptor<
  (
    history: any[],
    message: string,
    typeOfAI: string | undefined,
    model: string | { model: string; options: string } | undefined,
    data: Signal<{ value: string } | { error: unknown }>
  ) => void
> {
  throw new Error('Function not implemented.');
}
