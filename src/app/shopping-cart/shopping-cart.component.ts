import { Component } from '@angular/core';
import { Trip } from '../../assets/interfaces/trip';
import { CartService } from '../services/cart/cart.service';
import { TripsService } from '../services/trips/trips.service';
import { PurchasedService } from '../services/purchased/purchased.service';
import { CurrencyService } from '../services/currency/currency.service';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent {
  selectedTrips!: Map<Trip, number>;
  selectedTripsKeys!: Trip[];
  trips: Trip[] = [];
  totalOrderValue: number = 0;
  priceSign: string = '$';
  userId: string = '';

  constructor(private cartService: CartService, private tripsService: TripsService, private purchasedService: PurchasedService, private currencyService: CurrencyService, private authService: AuthService) {
    this.authService.user$.subscribe(user => {
      if (user) {
        this.userId = user.uid;
      }
    });
  }

  ngOnInit(): void {
    this.tripsService.trips$.subscribe((tripList: Trip[]) => {
      this.trips = tripList;
    });

    this.cartService.cart$.subscribe((cart: Map<Trip, number>) => {
      this.selectedTrips = cart;
      this.totalOrderValue = this.cartService.getTotalOrderValue();
      this.selectedTripsKeys = Array.from(cart.keys());
    });

    this.currencyService.priceSign$.subscribe(sign => this.priceSign = sign);
  }

  getTotal(): void {
    this.totalOrderValue = this.cartService.getTotalOrderValue();
  }

  buySelectedTrips(): void {
    let sign = '$';
    console.log(sign);
    let conversionRate = this.currencyService.convertCurrency(sign);
    this.tripsService.convertCurrency(conversionRate);
    this.cartService.updateCurrency();
    this.purchasedService.updateCurrency(conversionRate);

    this.selectedTrips.forEach((count, trip) => {
      if (trip.checked) {
        for (let i = 0; i < count; i++) {
          this.cartService.removeTrip(trip);
          trip.maxSeats--;
          trip.reservedSeats = 0;
          trip.checked = false;
        }
        this.purchasedService.addTrip(trip, count, this.userId);
        this.tripsService.updateTrip(trip);
      }
    });
  }

  returnSelectedTrip(trip: Trip): void {
    this.cartService.removeTrip(trip);
    trip.reservedSeats--;
  }

  reserveAdditionalSeatForTrip(trip: Trip): void {
    if (trip.reservedSeats === trip.maxSeats) {
      alert('No more seats available!');
      return;
    }
    this.cartService.addTrip(trip);
    trip.reservedSeats++;
  }
}