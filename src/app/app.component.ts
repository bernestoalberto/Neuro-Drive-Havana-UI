import {
  Component,
  HostListener,
  inject,
  signal,
  ViewEncapsulation,
  WritableSignal,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppService, Post } from './app.service';
import { AuthInterceptorService } from './auth/auth-interceptor.service';

import { ToolbarComponent } from './shared/toolbar/toolbar.component';
import { DashboardComponent } from "./shared/dashboard/dashboard.component";
@Component({
  selector: 'app-root',
  encapsulation: ViewEncapsulation.Emulated,
  imports: [RouterOutlet, ToolbarComponent, DashboardComponent],
  providers: [
    AppService,
    {
      provide: HTTP_INTERCEPTORS,
      multi: true,
      useClass: AuthInterceptorService,
    },
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  @HostListener('document:copy', ['$event'])
  onDocumentCopy(event: Event) {
    event.preventDefault();
  }
  title = 'bonet-gen-ai';
  loadedPost: Post[] = [];
  error = '';
  showSpinner: WritableSignal<boolean> = signal(false);
  private appService = inject(AppService);
  ngOnInit(): void {}

  setSpinnerStatus(event: any) {
    this.showSpinner.set(event.status);
  }

  private fetchPostData() {
    this.appService.onFetchFirebasePost().subscribe((posts: Array<Post>) => {
      this.loadedPost = posts;
    }),
      (error: any) => {
        this.error = error.message;
      };
  }
}
