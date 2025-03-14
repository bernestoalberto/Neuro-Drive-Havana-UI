import {
  Component,
  ElementRef,
  inject,
  OnInit,
  signal,
  ViewChild,
  WritableSignal,
  model,
  ChangeDetectionStrategy,
} from '@angular/core';
import { AppService } from '../../app.service';
import {
  MatProgressBarModule,
  ProgressBarMode,
} from '@angular/material/progress-bar';
import { ThemePalette } from '@angular/material/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormControl,
  Validators,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { MatFormField } from '@angular/material/form-field';
import { ModelGroup, AI_NAME, AiProvider } from '../../shared/helper';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { DialogComponent } from '../../shared/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ErrorResultComponent } from '../error-result/error-result.component';
import { SearchResultComponent } from '../search-result/search-result.component';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-image-upload',

  imports: [
    MatProgressBarModule,
    MatIconModule,
    ReactiveFormsModule,
    FormsModule,
    CdkDrag,
    MatFormField,
    MatInputModule,
    MatSelectModule,
    ErrorResultComponent,
    SearchResultComponent,
    CommonModule,
    MatCheckboxModule,
  ],
  templateUrl: './image-upload.component.html',
  styleUrl: './image-upload.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageUploadComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef = {} as ElementRef;
  selectedFile: File | null = null;
  anotherSelected: File | null = null;
  fileData: string = '';
  imageResult: string | ArrayBuffer | null = '';
  previewUrl: string | ArrayBuffer | null = '';
  uploadProgress = 0;
  checked = model(false);
  color: ThemePalette = 'primary';
  mode: ProgressBarMode = 'determinate';
  progressValue = 50;
  showFileInput = true;
  bufferValue = 75;
  outputBoxVisible = false;
  progress = `0%`;
  uploadResult = '';
  fileName = '';
  fileSize = '';
  errorMessage = '';
  prompt = '';
  uploadStatus: number | undefined;
  showSpinner: WritableSignal<boolean> = signal(false);
  hide = signal(true);
  aiProviderControl = 'aiProvider';
  modelControl = 'model';
  promptControl = 'prompt';
  imageControl = 'image';
  promptType = 'promptType';
  error = '';
  form = new FormGroup({
    model: new FormControl({ value: '', disabled: false }, [
      Validators.required,
    ]),
    image: new UntypedFormControl('', []),
    aiProvider: new FormControl('', [Validators.required]),
    prompt: new FormControl('', [Validators.required]),
    promptType: new FormControl('', []),
  });
  private appService = inject(AppService);
  messages = this.appService.messages;
  clearStatus: WritableSignal<boolean> = signal(false);
  readonly dialog = inject(MatDialog);
  chatHistory = signal<string[] | any>([]);
  geminiModelGroup: ModelGroup = {
    name: AI_NAME.GEMINI,
    disabled: false,
    model: [
      {
        value: 'gemini-2.0-flash-lite-preview',
        viewValue: `${AI_NAME.GEMINI} 2.0 Flash Lite Preview`,
      },
      {
        value: 'gemini-2.0-pro-expreimental',
        viewValue: `${AI_NAME.GEMINI} 2.0 Pro Expreimental`,
      },
      {
        value: 'gemini-2.0-flash',
        viewValue: `${AI_NAME.GEMINI} 2.0 Flash`,
      },
      {
        value: 'gemini-1.5-flash',
        viewValue: `${AI_NAME.GEMINI} 1.5 flash`,
      },
    ],
  };
  openAIModelGroup: ModelGroup = {
    name: AI_NAME.OPENAI,
    disabled: false,
    model: [
      { value: 'gpt-3.5-turbo', viewValue: 'GPT 3.5 Turbo' },
      { value: 'gpt-4o', viewValue: 'GPT 4o' },
      { value: 'gpt-4o-mini', viewValue: 'GPT 4o Mini' },
    ],
  };
  deepSeekModelGroup: ModelGroup = {
    name: AI_NAME.DEEPSEEK,
    disabled: false,
    model: [
      { value: 'deepseek-r1:1.5b', viewValue: `${AI_NAME.DEEPSEEK} R1:1.5b` },
    ],
  };
  llamaModelGroup: ModelGroup = {
    name: AI_NAME.LLAMA,
    disabled: false,
    model: [{ value: 'llama-3.2-3b-instruct', viewValue: `Llama-3.2` }],
  };
  claudeModelGroup: ModelGroup = {
    name: AI_NAME.CLAUDE,
    disabled: false,
    model: [
      { value: 'claude-3-7-sonnet-20250219', viewValue: `Claude 3.7 Sonnet` },
    ],
  };
  currentodel: ModelGroup[] = [];
  aiProviders: AiProvider[] = [
    {
      name: AI_NAME.GEMINI,
      id: AI_NAME.GEMINI.toLowerCase(),
    },
    {
      name: AI_NAME.OPENAI,
      id: AI_NAME.OPENAI.toLowerCase(),
    },
    {
      name: AI_NAME.DEEPSEEK,
      id: AI_NAME.DEEPSEEK.toLowerCase(),
    },
    {
      name: AI_NAME.LLAMA,
      id: AI_NAME.LLAMA.toLowerCase(),
    },
  ];

  constructor() {}

  ngOnInit() {
    this.form.controls.model.valueChanges.subscribe((value) => {
      if (this.form.value.aiProvider === AI_NAME.OPENAI) {
        this.dialog.open(DialogComponent, {
          data: {
            title: 'Open AI model selected',
            content: `This model ${value} is not free , please use it with responsability.`,
          },
        });
      }
    });
    this.form.controls.aiProvider.valueChanges.subscribe((value) => {
      let group = this.geminiModelGroup;
      this.currentodel = [];
      this.setShowSpinner(false);
      if (value === AI_NAME.OPENAI) {
        group = this.openAIModelGroup;
      } else if (value === AI_NAME.DEEPSEEK) {
        group = this.deepSeekModelGroup;
      } else if (value === AI_NAME.LLAMA) {
        group = this.llamaModelGroup;
      } else if (value === AI_NAME.CLAUDE) {
        group = this.claudeModelGroup;
      }
      this.currentodel = [...[], group];
    });
    this.form.controls.promptType.valueChanges.subscribe((value) => {
      let validators = [Validators.required];
      this.showFileInput = true;
      if (value) {
        this.showFileInput = false;
        validators = [];
      }
      this.form.controls.image.setValidators(validators);
    });
  }
  setShowSpinner(value = true) {
    this.showSpinner.set(value);
  }
  onFileSelected(event: Event): void {
    const currentElement = event.target as HTMLInputElement;
    if (currentElement.files && currentElement.files.length > 0) {
      this.selectedFile = currentElement.files[0];
      this.fileSize = `${(this.selectedFile.size / 1024).toFixed(2)} KB`;
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }
  removeImage() {
    this.selectedFile = null;
    this.uploadProgress = 0;
    this.previewUrl = '';
    this.form.controls.image.setValue(null);
  }

  onSubmitUpload(): void {
    if (!this.selectedFile) {
      this.appService.openSnackBar('No file selected!');
      return;
    }
    this.uploadImage();
  }
  clear() {
    this.clearStatus.set(false);
    this.prompt = '';
    this.sendError();
    this.showSpinner.set(false);
    this.chatHistory.set([]);
  }
  clearSearch() {
    this.prompt = '';
    (this.form as FormGroup).controls[this.promptControl].setValue('');
  }
  get isPromptFieldEmpty(): boolean {
    return this.form.value.prompt?.length === 0;
  }
  get isModelFieldEmpty(): boolean {
    return this.form.value.model?.length === 0;
  }
  uploadImage() {
    if (this.selectedFile && this.selectedFile.size > 0) {
      const { prompt, model, aiProvider } = this.form.value;
      this.setShowSpinner();
      const formData = new FormData();
      formData.append('thumbnail', this.selectedFile, this.selectedFile.name);

      // Log to verify FormData content
      console.log('FormData content:', formData.get('image'));

      this.appService
        .uploadImage(
          formData,
          this.chatHistory(),
          `${prompt}`,
          `${model}`,
          `${aiProvider}`
        )
        .subscribe((data) => {
          this.clearStatus.set(false);
          this.chatHistory.update((history) => {
            return [
              ...history,
              {
                role: 'user',

                parts: this.prompt,
              },
            ];
          });
          this.chatHistory.update((history) => {
            return [
              ...history,
              {
                role: 'model',
                parts: data['result'],
              },
            ];
          });
          this.setShowSpinner(false);
          // if (event.type === HttpEventType.UploadProgress && event.total) {
          //   this.uploadProgress = Math.round(
          //     (100 * event.loaded) / event.total
          //   );
          // } else if (event.type === HttpEventType.Response) {
          //   this.appService.openSnackBar('Upload successful');
          //   this.removeImage(); // Clear the form after successful upload
          // }
        });
      return;
    }
    this.appService.openSnackBar('Please select a valid file');
    return;
  }
  sendError(error: string = '') {
    this.errorMessage = error;
  }

  onFormSubmit() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.setShowSpinner();
      if (this.form.value.promptType) {
        const { prompt, model, aiProvider } = this.form.value;
        const imageResult = this.appService.createImage(
          this.chatHistory(),
          `${model}`,
          `${prompt}`,
          `${aiProvider}`
        )
        .subscribe((data: { result: any }) => {
          this.clearStatus.set(false);
          this.chatHistory.update((history) => {
            return [
              ...history,
              {
                role: 'user',

                parts: this.prompt,
              },
            ];
          });
          this.chatHistory.update((history) => {
            return [
              ...history,
              {
                role: 'model',
                parts: data['result'],
              },
            ];
          });
          this.setShowSpinner(false);
        });
        return;
      }
      this.onSubmitUpload();
    } else {
      this.appService.openSnackBar();
      this.sendError('Please fill all required fields');
    }
  }
  handleDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  handleDrop(event: DragEvent) {
    // Fix this
    event.preventDefault();
    if (event.dataTransfer) {
      const file: File = event.dataTransfer.files[0];
      this.onFileSelected(event);
    }
  }
}
