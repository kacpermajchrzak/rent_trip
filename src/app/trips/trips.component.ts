import { Component } from '@angular/core';
import { Trip } from '../../assets/interfaces/trip';
import { TripsService } from '../services/trips/trips.service';
import { CartService } from '../services/cart/cart.service';


@Component({
  selector: 'app-trips',
  templateUrl: './trips.component.html',
  styleUrl: './trips.component.css'
})
export class TripsComponent {
  trips: Trip[] = [];
  selectedTrips!: Map<Trip, number>;
  totalOrderValue: number = 0;
  minPrice: number = 0;
  maxPrice: number = 0;
  totalReservedSeats: number = 0;
  rating: number = NaN;
  location: string = '';
  startDate: Date | null = null;
  endDate: Date | null = null;
  minPricePipe: number = NaN;
  maxPricePipe: number = NaN;
  currentPage = 1;
  itemsPerPage = 6;

  constructor(private tripsService: TripsService, private cartService: CartService) { }

  ngOnInit(): void {
    this.tripsService.trips$.subscribe((tripList: Trip[]) => {
      this.trips = tripList;
      this.updatePriceRange();
    });

    this.cartService.cart$.subscribe((cart: Map<Trip, number>) => {
      this.selectedTrips = cart;
      this.totalOrderValue = this.cartService.getTotalOrderValue();
      let total = 0;
      this.selectedTrips.forEach((count, trip) => {
        total += count;
      });
      this.totalReservedSeats = total;
    });
  }

  reserveSeat(trip: Trip): void {
    this.cartService.addTrip(trip);
  }

  cancelSeat(trip: Trip): void {
    this.cartService.removeTrip(trip);
  }

  handleDelete(index: number): void {
    const tripToDelete = this.trips[index];
    this.tripsService.removeTrip(tripToDelete);
  }

  handleAdd(trip: Trip): void {
    this.tripsService.addTrip(trip);
  }

  handleFiltersChanged(filters: any): void {
    this.location = filters.location;
    this.minPricePipe = filters.minPrice;
    this.maxPricePipe = filters.maxPrice;
    this.startDate = filters.startDate;
    this.endDate = filters.endDate;
    this.rating = filters.rating;
  }

  private updatePriceRange(): void {
    let availableTrips = this.trips.filter(trip => trip.maxSeats > 0);
    this.minPrice = Math.min(...availableTrips.map(trip => trip.price));
    this.maxPrice = Math.max(...availableTrips.map(trip => trip.price));
  }

  getDisplayedTrips() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = Number(start) + Number(this.itemsPerPage);
    return this.trips.slice(start, end);
  }
}
