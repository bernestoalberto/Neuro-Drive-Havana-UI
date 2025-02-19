import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import {MatMenuModule} from '@angular/material/menu';
import {MatBadgeModule} from '@angular/material/badge';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-toolbar',

  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule, MatDividerModule, MatBadgeModule],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToolbarComponent {
  router = inject(Router);
  auth = inject(Auth);
  userNotifications = 2;
  authService = inject(AuthService);
  homeMenuOptions =[ {
    id: 1,
    matMenuTriggerFor: "aboveMenu",
    positionLabel: "Above",
    yPosition: "above",
    xPosition: "befor",
    children: [
      {id: 1 , name: "Item 1", icon: "home", link: "/item1"},
      {id: 2, name: "Item 2", icon: "home", link: "/item2"}
    ]
  }];
}
