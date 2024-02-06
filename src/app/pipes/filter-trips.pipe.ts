import { Pipe, PipeTransform } from '@angular/core';
import { Trip } from '../../assets/interfaces/trip';

@Pipe({
  name: 'filterTrips'
})
export class FilterTripsPipe implements PipeTransform {

  transform(trips: Trip[], filterStatus: 'all' | 'upcoming' | 'active' | 'archived'): Trip[] {
    if (filterStatus === 'all') {
      return trips;
    }

    return trips.filter(trip => {
      const currentDate = new Date();
      const startDate = new Date(trip.startDate);
      const endDate = new Date(trip.endDate);

      if (filterStatus === 'upcoming' && startDate.getTime() > currentDate.getTime()) {
        return true;
      } else if (filterStatus === 'active' && startDate.getTime() <= currentDate.getTime() && endDate.getTime() >= currentDate.getTime()) {
        return true;
      } else if (filterStatus === 'archived' && endDate.getTime() < currentDate.getTime()) {
        return true;
      }

      return false;
    });
  }

}