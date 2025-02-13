import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [MatMenuModule, MatButtonModule, CommonModule, MatIconModule, MatDividerModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  router = inject(Router);
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
