import { Pipe, PipeTransform } from '@angular/core';
import { Trip } from '../../assets/interfaces/trip';

@Pipe({ name: 'ratingPipe' })
export class RatingPipe implements PipeTransform {
    transform(trips: Trip[], rating: number): Trip[] {
        if (!trips || !rating) return trips;
        return trips.filter(trip => {
            let totalRating = 0;
            let ratingCount = 0;
            let index = 0;
            trip.rating.forEach((value) => {
                index++;
                totalRating += value * index;
                ratingCount += value;
            });
            return totalRating / ratingCount >= rating;
        });
    }
}