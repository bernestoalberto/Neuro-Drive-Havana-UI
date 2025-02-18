import { Routes } from '@angular/router';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { authGuard } from './auth/auth.guard';
import { ImageUploadComponent } from './image-upload/image-upload.component';
import { promptResolver } from './prompt-input/prompt.resolver';

import { HomeComponent } from './home/home.component';


export const routes: Routes = [
  { path: '', redirectTo: 'Prompt', pathMatch: 'full' },
  { path: 'home',title: 'Home', component: HomeComponent },
  { path: 'prompt',title: 'Prompt' , loadComponent: () => import('./prompt-input/prompt-input.component').then(c => c.PromptInputComponent),
    // canActivate: [authGuard],
    children: [
      {path: 'image-generation', component: ImageUploadComponent,
            resolve:[promptResolver]
      }],

 },
 { path: 'not-found', loadComponent: () => import('./page-not-found/page-not-found.component').then(c => c.PageNotFoundComponent)  , data: {message: 'Page not found!'} },
 { path: 'login', component: LoginComponent },
 { path: 'register', component: RegisterComponent }
];
