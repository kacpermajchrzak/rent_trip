import { Pipe, PipeTransform } from '@angular/core';
import { Trip } from '../../assets/interfaces/trip';

@Pipe({ name: 'datePipe' })
export class DatePipe implements PipeTransform {
    transform(trips: Trip[], startDate: Date | null, endDate: Date | null): Trip[] {
        if (!trips) return trips;
        if (startDate) {
            trips = trips.filter(trip => trip.startDate >= startDate);
        }
        if (endDate) {
            trips = trips.filter(trip => trip.endDate <= endDate);
        }
        if (startDate && endDate) {
            trips = trips.filter(trip => trip.startDate >= startDate && trip.endDate <= endDate);
        }
        return trips;
    }
}