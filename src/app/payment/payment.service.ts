import { computed, Injectable, Signal, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})


export class PaymentService {
  private amount: Signal<number> = signal(0.00);
  transactioID = '';
  constructor() { }

  getTotalAmount: Signal<number> = computed(() => this.amount());
}
