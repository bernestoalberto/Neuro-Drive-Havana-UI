import { Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { authGuard } from './auth/auth.guard';
import { ImageUploadComponent } from './image-upload/image-upload.component';
import { promptResolver } from './prompt-input/prompt.resolver';

import { HomeComponent } from './home/home.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
// import { UserProfileComponent } from './user-profile/user-profile.component';


export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    component: HomeComponent

  },
  { path: 'prompt',title: 'Prompt' , loadComponent: () => import('./prompt-input/prompt-input.component').then(c => c.PromptInputComponent),
    canActivate: [authGuard],
    children: [
      {path: 'image-generation', component: ImageUploadComponent,
            resolve:[promptResolver]
      }],
 },
 { path: 'not-found', loadComponent: () => import('./page-not-found/page-not-found.component').then(c => c.PageNotFoundComponent)  , data: {message: 'Page not found!'} },
 { path: 'login', component: AuthComponent },
 {
   path: 'register',
   loadComponent:() => import('./auth/register/register.component').then(c => c.RegisterComponent)
  },
 { path: 'reset-password', component: ResetPasswordComponent },
 { path: 'user-profile',
  loadComponent:() => import('./user-profile/user-profile.component').then(c => c.UserProfileComponent),
  canActivate: [authGuard] }
];
