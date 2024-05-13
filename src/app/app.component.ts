// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { RouterOutlet } from '@angular/router';

// @Component({
//   selector: 'app-root',
//   standalone: true,
//   imports: [CommonModule, RouterOutlet],
//   templateUrl: './app.component.html',
//   styleUrl: './app.component.scss'
// })
// export class AppComponent {
//   title = 'bonetGenAI';
// }

import { Component, Inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PromptInputComponent } from './prompt-input/prompt-input.component';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
import { ErrorResultComponent } from './error-result/error-result.component';
import { ImageUploadComponent } from './image-upload/image-upload.component';
import { SearchResultComponent } from './search-result/search-result.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppService, Post } from './app.service';
import { AuthInterceptorService } from './auth/auth-interceptor.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, PromptInputComponent, LoadingSpinnerComponent, ErrorResultComponent, ImageUploadComponent, SearchResultComponent, HttpClientModule],
  providers: [
    AppService,
    {provide: HTTP_INTERCEPTORS, multi: true , useClass: AuthInterceptorService}
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass',
})
export class AppComponent {
  title = 'bonet-gen-ai';
  chatHistory: any[] = [];
  loadedPost: Post[] = [];
  showSpinner: Boolean = false;
  error = '';
  // appService = Inject(AppService);
  constructor(private appService: AppService) { }
  ngOnInit(): void {
    // this.appService.onCreateFirebasePost({ title :'Harry Potter', content:'The philosopher stone'  });
    this.fetchPostData();

  }
  getErrorMessage(event: any){
    this.error = event;
  }
  setSpinnerStatus(event : any){
    this.showSpinner = event.status;
  }
  setChatHistory(event : any){
    this.chatHistory = event;
  }
  private fetchPostData(){
    this.appService.onFetchFirebasePost()
    .subscribe(posts => {
      this.loadedPost = posts;
    }), (error: any) =>{
      this.error = error.message;
    }
  }
}



