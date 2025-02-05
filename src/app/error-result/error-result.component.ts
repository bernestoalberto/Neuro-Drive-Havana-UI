import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-error-result',

  imports: [CommonModule],
  templateUrl: './error-result.component.html',
  styleUrl: './error-result.component.sass'
})
export class ErrorResultComponent {
  @Input({required: true}) errorMessage: string = '';

}
