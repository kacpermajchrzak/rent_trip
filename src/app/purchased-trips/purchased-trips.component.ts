import { Component } from '@angular/core';
import { Trip } from '../../assets/interfaces/trip';
import { PurchasedService } from '../services/purchased/purchased.service';
import { CurrencyService } from '../services/currency/currency.service';

@Component({
  selector: 'app-purchased-trips',
  templateUrl: './purchased-trips.component.html',
  styleUrl: './purchased-trips.component.css'
})
export class PurchasedTripsComponent {
  purchasedTrips!: Map<Trip, { count: number, date: Date }>;
  purchasedTripsKeys!: Trip[];
  filterStatus: 'all' | 'upcoming' | 'active' | 'archived' = 'all';
  totalOrderValue: number = 0;
  currencySign: string = '$';

  constructor(private purchasedService: PurchasedService, private currencyService: CurrencyService) { }

  ngOnInit(): void {
    this.purchasedService.purchased$.subscribe((purchased: Map<Trip, { count: number, date: Date }>) => {
      this.purchasedTrips = purchased;
      this.purchasedTripsKeys = Array.from(purchased.keys());
      this.totalOrderValue = this.purchasedService.getTotalOrderValue(this.filterStatus);
      this.purchasedService.updateTripStartingSoon(purchased);
    });

    this.currencyService.priceSign$.subscribe((sign: string) => this.currencySign = sign);

  }

  onFilterChange(): void {
    this.totalOrderValue = this.purchasedService.getTotalOrderValue(this.filterStatus);
  }

  calculateStatus(trip: Trip): 'upcoming' | 'active' | 'archived' {
    const currentDate = new Date();
    const startDate = new Date(trip.startDate);
    const endDate = new Date(trip.endDate);

    if (startDate.getTime() > currentDate.getTime()) {
      return 'upcoming';
    } else if (startDate.getTime() <= currentDate.getTime() && endDate.getTime() >= currentDate.getTime()) {
      return 'active';
    } else if (endDate.getTime() < currentDate.getTime()) {
      return 'archived';
    }
    return 'upcoming';
  }

  getTripsValue(trip: Trip): number {
    return trip.price * this.purchasedTrips.get(trip)!.count;
  }
}
