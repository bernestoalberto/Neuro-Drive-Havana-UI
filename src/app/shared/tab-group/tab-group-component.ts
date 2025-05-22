import {
  Component,
  Input,
  input,
  signal,
  ChangeDetectionStrategy,
  output,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { Tab } from '../helper';

@Component({
  selector: 'app-tab-group',
  imports: [MatTabsModule, MatButtonModule, MatIconModule],
  templateUrl: './tab-group.component.html',
  styleUrl: './tab-group.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabGroupComponent {
  tabs = input.required<Array<string>>();
  @Input() content: Tab[] = [];
  selected = signal(0);
  tabClicked = output<number>();
  activeLink = ' ';

  onTabChanged(event: number) {
    this.selected.set(event);
    this.tabClicked.emit(event);
  }
}
