
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-error-result',

  imports: [],
  templateUrl: './error-result.component.html',
  styleUrl: './error-result.component.scss'
})
export class ErrorResultComponent {
  @Input({required: true}) errorMessage: string = '';

}
