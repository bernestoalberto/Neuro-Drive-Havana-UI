
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-search-result',

  imports: [],
  templateUrl: './search-result.component.html',
  styleUrl: './search-result.component.sass'
})
export class SearchResultComponent {

  @Input({required: true}) chatHistory: Array<any> = [];

  constructor() { }

}
