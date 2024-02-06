import { CurrencyService } from '../services/currency/currency.service';
import { Component } from '@angular/core';
import { Trip } from '../../assets/interfaces/trip';
import { CartService } from '../services/cart/cart.service';

@Component({
  selector: 'app-selected-trip-summary',
  templateUrl: './selected-trip-summary.component.html',
  styleUrl: './selected-trip-summary.component.css'
})
export class SelectedTripSummaryComponent {
  selectedTrips!: Map<Trip, number>;
  totalOrderValue: number = 0;
  selectedTripsCount: number = 0;
  currencySign: string = '$';

  constructor(private cartService: CartService, private currencyService: CurrencyService) { }
  ngOnInit(): void {
    this.cartService.cart$.subscribe((cart: Map<Trip, number>) => {
      this.selectedTrips = cart;
      this.totalOrderValue = this.cartService.getTotalOrder();
      let total = 0;
      this.selectedTrips.forEach((count) => {
        total += count;
      });
      this.selectedTripsCount = total;
    });

    this.currencyService.priceSign$.subscribe((sign: string) => {
      this.currencySign = sign;
    });
  }
}
