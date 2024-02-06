import { Pipe, PipeTransform } from '@angular/core';
import { Trip } from '../../assets/interfaces/trip';

@Pipe({ name: 'pricePipe' })
export class PricePipe implements PipeTransform {
    transform(trips: Trip[], minPricePipe: number, maxPricePipe: number): Trip[] {
        if (!trips) return trips;
        if (minPricePipe) {
            trips = trips.filter(trip => trip.price >= minPricePipe);
        }
        if (maxPricePipe) {
            trips = trips.filter(trip => trip.price <= maxPricePipe);
        }
        if (minPricePipe && maxPricePipe) {
            trips.filter(trip => trip.price >= minPricePipe && trip.price <= maxPricePipe);
        }
        if (!trips || (!minPricePipe && !maxPricePipe)) return trips;
        return trips;
    }
}