import { AuthService } from './../auth/auth.service';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';
import { Trip } from '../../../assets/interfaces/trip';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from '../../../assets/interfaces/user';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Subscription } from 'rxjs';

interface Purchased {
  userId: string;
  tripId: string;
  count: number;
  purchasedDate?: string;
  rated: boolean;
}

const TEN_DAYS = 10;

@Injectable({
  providedIn: 'root'
})
export class PurchasedService {
  private purchasedSubject = new BehaviorSubject<Map<Trip, { count: number, date: Date }>>(new Map());
  purchased$ = this.purchasedSubject.asObservable();
  private tripStartingSoonSource = new BehaviorSubject<boolean>(false);
  tripStartingSoon$ = this.tripStartingSoonSource.asObservable();
  private userId = '';
  private purchasedSubscription: Subscription | null = null;

  constructor(private firestore: AngularFirestore, private authService: AuthService) {
    this.authService.user$.subscribe(user => {
      if (user) {
        this.userId = user.uid;
        this.fetchPurchased();
      } else {
        this.userId = '';
        if (this.purchasedSubscription) {
          this.purchasedSubscription.unsubscribe();
          this.purchasedSubscription = null;
        }
        this.purchasedSubject.next(new Map());
      }
    });
  }

  async fetchPurchased(): Promise<void> {
    if (this.purchasedSubscription) {
      this.purchasedSubscription.unsubscribe();
    }
    this.purchasedSubscription = this.firestore.collectionGroup<Purchased>('purchased', ref => ref.where('userId', '==', this.userId)).valueChanges().subscribe(async purchased => {
      const purchasedMap = new Map();

      const promises: Promise<void>[] = [];
      purchased.forEach(purchase => {
        const trip = this.firestore.doc<Trip>('trips/' + purchase.tripId).get();
        const promise = firstValueFrom(trip).then(t => {
          purchasedMap.set(t.data()!, { count: purchase.count, date: purchase.purchasedDate });
        });
        promises.push(promise);
      });

      try {
        await Promise.all(promises);
        this.purchasedSubject.next(purchasedMap);
        this.updateTripStartingSoon(purchasedMap);
      } catch (error) {
        console.error('Error fetching purchased trips:', error);
      }
    });
  }

  updateTripStartingSoon(purchasedTrips: Map<Trip, { count: number, date: Date }>) {
    const currentDate = new Date();
    const tenDaysFromNow = new Date(currentDate.setDate(currentDate.getDate() + TEN_DAYS));
    let value = false;
    currentDate.setDate(currentDate.getDate() - TEN_DAYS);

    for (let trip of purchasedTrips.keys()) {
      const startDate = new Date(trip.startDate);
      if (startDate.getTime() <= tenDaysFromNow.getTime() && startDate.getTime() > currentDate.getTime()) {
        value = true;
      }
    }
    this.tripStartingSoonSource.next(value);
  }

  addTrip(trip: Trip, count: number, uid: string): void {
    count += this.purchasedSubject.getValue().get(trip)?.count || 0;

    this.firestore.collection<Purchased>('trips/' + trip.id + '/purchased').add({
      userId: uid,
      tripId: trip.id,
      count: count,
      purchasedDate: new Date().toISOString().slice(0, 10),
      rated: false
    });
    this.fetchPurchased();
  }

  updateUserRatedTrip(tripId: string, userId: string): void {
    console.log(tripId);
    this.firestore.collectionGroup<Purchased>('purchased', ref => ref.where('userId', '==', userId)).get().subscribe(purchased => {
      console.log(purchased);
      purchased.forEach(p => {
        const docRef = this.firestore.collection<Purchased>('trips/' + tripId + '/purchased').doc(p.id);
        docRef.get().subscribe(docSnapshot => {
          if (docSnapshot.exists) {
            docRef.update({ rated: true });
          } else {
            console.error('No document to update');
          }
        });
      });
    });
  }

  getTotalOrderValue(filterStatus: string): number {
    const currentPurchased = this.purchasedSubject.getValue();
    let total = 0;
    currentPurchased.forEach(({ count }, trip) => {
      if (this.filterTrips(trip, filterStatus)) {
        total += trip.price * count;
      }
    });
    return parseFloat((total).toFixed(2));
  }

  filterTrips(trip: Trip, filterStatus: string): boolean {
    const currentDate = new Date();
    const startDate = new Date(trip.startDate);
    const endDate = new Date(trip.endDate);
    if (filterStatus === 'all') {
      return true;
    }
    else if (startDate.getTime() > currentDate.getTime() && filterStatus === 'upcoming') {
      return true;
    } else if (startDate.getTime() <= currentDate.getTime() && endDate.getTime() >= currentDate.getTime() && filterStatus === 'active') {
      return true;
    } else if (endDate.getTime() < currentDate.getTime() && filterStatus === 'archived') {
      return true;
    }
    return false;
  }

  updateCurrency(currency: number): void {
    const currentPurchased = this.purchasedSubject.getValue();
    currentPurchased.forEach(({ count }, trip) => {
      trip.price = parseFloat((trip.price * currency).toFixed(2));
    });
    this.purchasedSubject.next(currentPurchased);
  }

  userBoughtTrip(trip: Trip, user: User): Observable<boolean> {
    return this.firestore.collectionGroup<Purchased>('purchased', ref => ref.where('userId', '==', user.uid))
      .valueChanges()
      .pipe(
        map(purchased => purchased.some(o => o.tripId === trip.id))
      );
  }

  userRatedTrip(trip: Trip, user: User): Observable<boolean> {
    return this.firestore.collectionGroup<Purchased>('purchased', ref => ref.where('userId', '==', user.uid))
      .valueChanges()
      .pipe(
        map(purchased => purchased.some(o => o.tripId === trip.id && o.rated))
      );
  }
}
