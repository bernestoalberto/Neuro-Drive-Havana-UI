import { style } from '@angular/animations';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { window } from 'rxjs';
import { PaymentService } from './payment.service';
import { CommonModule } from '@angular/common';
import { on } from 'process';
import { TRANSACTION } from './constants';

@Component({
  selector: 'app-payment',
  imports: [CommonModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.sass',
  preserveWhitespaces: true
})
export class PaymentComponent {
 cancelLabel = 'Cancel';
 amount = 0.00;
 info = 'Please do not refresh the browser while the transaction is processing';
 amountToPay ='Total amount to pay:';

 @ViewChild( 'paymentRef', {static: true}) paymentRef!: ElementRef;

 constructor(private router: Router, private paymentService: PaymentService) { }

 ngOnInit(){
  this.amount = this.paymentService.getTotalAmount();
  (window as any).paypal.Buttons({
      style: {
        layout: 'horizontal',
        color: 'blue',
        shape: 'rect',
        label: 'paypal'
      },
      createOrder: (data: any, actions: any)  => {
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: this.amount.toString(),
              currency_code: 'USD'
            }
          }]
        });
      },
      onApprove: (data: any, actions: any)  => {
        return actions.order.capture().then((details: any) => {
        if(details.status === TRANSACTION.COMPLETED){
          this.paymentService.transactioID = details.id;
          this.router.navigate(['order-confirmation']);

        }
        });
      },
      onError: (err: any) => {
        console.log(err);
      }
  }).render(this.paymentRef?.nativeElement);
 }

 cancel(){
  console.log('cancel');
  this.router.navigate(['cart']);
 }
}
