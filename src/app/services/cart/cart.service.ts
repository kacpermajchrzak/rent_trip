import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Trip } from '../../../assets/interfaces/trip';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cartSubject = new BehaviorSubject<Map<Trip, number>>(new Map());
  cart$ = this.cartSubject.asObservable();

  addTrip(trip: Trip): void {
    const currentCart = this.cartSubject.getValue();
    const count = currentCart.get(trip) || 0;
    currentCart.set(trip, count + 1);
    this.cartSubject.next(currentCart);
  }

  removeTrip(trip: Trip): void {
    const currentCart = this.cartSubject.getValue();
    if (currentCart.has(trip)) {
      const count = currentCart.get(trip) || 0;
      if (count > 1) {
        currentCart.set(trip, count - 1);
      } else {
        currentCart.delete(trip);
      }
    }
    this.cartSubject.next(currentCart);
  }

  clearCart(): void {
    this.cartSubject.next(new Map());
  }

  getTotalOrderValue(): number {
    const currentCart = this.cartSubject.getValue();
    let total = 0;
    currentCart.forEach((count, trip) => {
      if (trip.checked)
        total += trip.price * count;
    });
    return parseFloat((total).toFixed(2));
  }

  getTotalOrder(): number {
    const currentCart = this.cartSubject.getValue();
    let total = 0;
    currentCart.forEach((count, trip) => {
      total += trip.price * count;
    });
    return total;
  }

  getTrips(): Map<Trip, number> {
    return this.cartSubject.getValue();
  }

  updateCurrency(): void {
    const currentCart = this.cartSubject.getValue();
    this.cartSubject.next(currentCart);
  }
}