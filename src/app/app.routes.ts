import { Routes } from '@angular/router';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { PromptInputComponent } from './prompt-input/prompt-input.component';
import { authGuard } from './auth/auth.guard';
import { ImageUploadComponent } from './image-upload/image-upload.component';
import { promptResolver } from './prompt-input/prompt.resolver';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';


export const routes: Routes = [
  // { path: '', redirectTo: 'home', pathMatch: 'full' },
  // { path: 'home', component: HomeComponent },
  // { path: 'about', component: AboutComponent },
  // { path: 'contact', component: ContactComponent },
  // { path: 'products', component: ProductsComponent },
  // { path: 'product/:id', component: ProductComponent },
  // { path: 'cart', component: CartComponent },
  // { path: 'checkout', component: CheckoutComponent },
  // {path: 'query', component: PromptInputComponent,
  //  canActivate: [authGuard],
  //  children: [
  // {path: 'image-generation', component: ImageUploadComponent,
  //       resolve:[promptResolver]
  // }
  // ]},
  // { path: 'not-found', component: PageNotFoundComponent  , data: {message: 'Page not found!'} },
  // { path: 'login', component: LoginComponent },
  // { path: 'register', component: RegisterComponent, pathMatch: 'full' }
];
