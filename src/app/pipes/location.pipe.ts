import { Pipe, PipeTransform } from '@angular/core';
import { Trip } from '../../assets/interfaces/trip';

@Pipe({ name: 'locationPipe' })
export class LocationPipe implements PipeTransform {
    transform(trips: Trip[], location: string): Trip[] {
        if (!trips || !location) return trips;
        return trips.filter(trip => trip.destination.toLowerCase().includes(location.toLowerCase()));
    }
}