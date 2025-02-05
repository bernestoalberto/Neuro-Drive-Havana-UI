import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';

@Component({
  selector: 'app-toolbar',

  imports: [MatToolbarModule, MatButtonModule, MatIconModule],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.sass'
})
export class ToolbarComponent {

}
