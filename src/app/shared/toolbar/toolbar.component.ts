import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import {MatMenuModule} from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-toolbar',

  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule, CommonModule, MatDividerModule],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToolbarComponent {
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
