import { Component, inject, Inject } from '@angular/core';
import { PaymentService } from '../payment/payment.service';

@Component({
  selector: 'app-confirmation',
  imports: [],
templateUrl: './confirmation.component.html',
  styleUrl: './confirmation.component.sass'
})
export class ConfirmationComponent {
  private paymentService = inject(PaymentService);
  private transactionID = '';

  ngOnInit(){
    this.transactionID = this.paymentService.transactioID;
  }
}
