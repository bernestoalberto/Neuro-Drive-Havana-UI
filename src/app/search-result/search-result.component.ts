import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-search-result',

  imports: [CommonModule],
  templateUrl: './search-result.component.html',
  styleUrl: './search-result.component.sass'
})
export class SearchResultComponent {

  @Input({required: true}) chatHistory: Array<any> = [];

  constructor() { }

}
