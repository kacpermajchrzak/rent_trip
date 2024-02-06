import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Trip } from '../../../assets/interfaces/trip';
import { Review } from '../../../assets/interfaces/trip';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { User } from '../../../assets/interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class TripsService {

  private tripsSubject = new BehaviorSubject<Trip[]>([]);
  trips$ = this.tripsSubject.asObservable();


  constructor(private firestore: AngularFirestore) {
    this.fetchTrips();
  }

  fetchTrips(): void {
    this.firestore.collection<Trip>('trips').valueChanges().subscribe(trips => {
      this.tripsSubject.next(trips);
    });
  }

  addUser(user: User): void {
    this.firestore.collection<User>('users').doc(user.uid).set(user).then(() => {
      this.fetchTrips();
    });
  }

  getUser(uid: string): Observable<User | undefined> {
    return this.firestore.collection<User>('users').doc(uid).valueChanges();
  }


  addTrip(trip: Trip): void {
    const id = this.firestore.createId();
    trip.id = id;
    this.firestore.collection<Trip>('trips').doc(id).set(trip).then(() => {
      this.fetchTrips();
    });
  }

  removeTrip(trip: Trip): void {
    this.firestore.collection<Trip>('trips').doc(trip.id).delete().then(() => {
      this.fetchTrips();
    }).catch(error => {
      console.error("Error removing document: ", error);
    });
  }

  updateTrip(updatedTrip: Trip): void {
    this.firestore.collection<Trip>('trips').doc(updatedTrip.id).update(updatedTrip).then(() => {
      this.fetchTrips();
    });
  }

  getTrips(): Trip[] {
    return this.tripsSubject.getValue();
  }

  convertCurrency(currency: number): void {
    const currentTrips = this.tripsSubject.getValue();
    currentTrips.forEach(trip => {
      trip.price = parseFloat((trip.price * currency).toFixed(2));
    });
    this.tripsSubject.next(currentTrips);
  }

  addReview(trip: Trip, review: Review): void {
    const id = this.firestore.createId();
    review.id = id;
    this.firestore.collection<Review>('trips/' + trip.id + '/reviews').doc(id).set(review).then(() => {
      this.fetchTrips();
    });
  }

  getReviews(trip: Trip): Observable<Review[]> {
    return this.firestore.collection<Review>('trips/' + trip.id + '/reviews').valueChanges();
  }


}