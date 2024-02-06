import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private priceSignSubject = new BehaviorSubject<string>('$');
  priceSign$ = this.priceSignSubject.asObservable();
  public currencyChanged: EventEmitter<string> = new EventEmitter();

  setPriceSign(priceSign: string): void {
    this.priceSignSubject.next(priceSign);
  }

  convertCurrency(to: string): number {
    let conversionRate = this.calculateConversionRate(this.priceSignSubject.getValue(), to);
    this.setPriceSign(to);
    this.currencyChanged.emit(to);
    return conversionRate;
  }

  private calculateConversionRate(from: string, to: string): number {
    let conversionRate = 1;
    if (from === '$' && to === '€') {
      conversionRate = 3.96 / 4.3;
    } else if (from === '€' && to === '$') {
      conversionRate = 4.3 / 3.96;
    } else if (from === '$' && to === 'zl') {
      conversionRate = 3.96;
    } else if (from === 'zl' && to === '$') {
      conversionRate = 1 / 3.96;
    } else if (from === '€' && to === 'zl') {
      conversionRate = 4.3;
    } else if (from === 'zl' && to === '€') {
      conversionRate = 1 / 4.3;
    }
    from = to;
    return conversionRate;
  }
}
