import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { AuthService } from '../auth/auth.service';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-user-profile',
  imports: [MatCardModule, MatIconModule, CommonModule, MatListModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent {
  private authService = inject(AuthService);
  private auth = inject(Auth);
  user;

  constructor() {
    this.user = this.auth.currentUser;
  }

  editProfile() {
    console.log('Edit profile clicked');
    // Implement profile editing logic here
  }

  logout() {
  this.authService.logout();
  }
}
