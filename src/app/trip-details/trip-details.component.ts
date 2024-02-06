import { AuthService } from './../services/auth/auth.service';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Trip } from '../../assets/interfaces/trip'
import { Review } from '../../assets/interfaces/trip';
import { TripsService } from '../services/trips/trips.service';
import { CartService } from '../services/cart/cart.service';
import { CurrencyService } from '../services/currency/currency.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { User } from '../../assets/interfaces/user';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { PurchasedService } from '../services/purchased/purchased.service';
import { OnInit } from '@angular/core';
import * as L from 'leaflet';


@Component({
  selector: 'app-trip-details',
  templateUrl: './trip-details.component.html',
  styleUrl: './trip-details.component.css'
})
export class TripDetailsComponent implements OnInit {
  trip?: Trip;
  reviews?: Review[];
  priceSign: string = '$';
  stars: boolean[] = Array(5).fill(false);
  totalRating: number = 0;
  addReviewButton: boolean = false;
  user?: User;
  userRole: string = 'guest';
  boughtTrip: boolean = false;
  tripRated: boolean = true;
  tripForm = new FormGroup({
    title: new FormControl('', Validators.required),
    comment: new FormControl('', [Validators.required, Validators.minLength(50), Validators.maxLength(500)]),
    purchasedDate: new FormControl(null),
  });

  constructor(private tripsService: TripsService, private cartService: CartService, private currencyService: CurrencyService, private route: ActivatedRoute, private authService: AuthService, private purchasedService: PurchasedService) { }

  ngOnInit(): void {
    const tripId = this.route.snapshot.paramMap.get('id');

    this.tripsService.trips$.subscribe((tripList: Trip[]) => {
      this.trip = tripList.filter((trip: Trip) => trip.id === tripId)[0];

      if (this.trip && this.trip.rating) {
        let size = 0;
        this.totalRating = 0;

        for (let i in this.trip.rating) {
          const ratingValue = this.trip.rating[i];
          this.totalRating += (Number(i) + 1) * ratingValue;
          size += ratingValue;
        }

        this.totalRating = parseFloat((this.totalRating / size).toFixed(2)) || 0;
      }

      if (this.trip) {
        this.tripsService.getReviews(this.trip).subscribe(reviews => {
          this.reviews = reviews;
        });
        if (this.user) {
          this.checkUserTrip();
        }
      }
    });

    this.authService.user$.pipe(
      switchMap(user => user ? this.tripsService.getUser(user.uid) : of(null))
    ).subscribe((user: User | null | undefined) => {
      this.user = user || undefined;
      this.userRole = this.user?.role || 'guest';

      if (this.trip) {
        this.checkUserTrip();
      }
    });

    this.currencyService.priceSign$.subscribe((currency: string) => {
      this.priceSign = currency;
    });

    const map = L.map('map').setView([this.trip?.latitude || 50.0673, this.trip?.longitude || 19.9123], 15.5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
    }).addTo(map);
  }

  private checkUserTrip(): void {
    this.purchasedService.userBoughtTrip(this.trip!, this.user!).subscribe({
      next: userBought => {
        this.boughtTrip = userBought;
      },
      error: error => {
        console.error('Error checking if user bought trip:', error);
      }
    });

    this.purchasedService.userRatedTrip(this.trip!, this.user!).subscribe({
      next: userRated => {
        this.tripRated = userRated;
      },
      error: error => {
        console.error('Error checking if user rated trip:', error);
      }
    });
  }

  handleRate(rating: number): void {
    if (this.trip && this.user && this.userRole === 'user' && this.boughtTrip && !this.tripRated) {
      const currentRating = this.trip.rating[rating - 1];
      this.trip.rating[rating - 1] = currentRating + 1;
      this.tripsService.updateTrip(this.trip);
      this.purchasedService.updateUserRatedTrip(this.trip.id, this.user.uid);
    }
  }


  addReview(): void {
    console.log(this.userRole === 'user', this.boughtTrip);
    if (this.tripForm.valid && (this.userRole === 'manager' || (this.userRole === 'user' && this.boughtTrip))) {
      const review: Review = {
        id: "Asd",
        userId: this.user?.uid || '',
        nickname: this.user?.email || '',
        purchasedDate: this.tripForm.value.purchasedDate || '',
        title: this.tripForm.value.title || '',
        comment: this.tripForm.value.comment || '',
      };
      if (this.trip) {
        this.tripsService.addReview(this.trip, review);
      }
      this.tripForm.reset();
    }
    else {
      alert('You must bought a trip in to add a review');
    }
  }

  showForm(): void {
    this.addReviewButton = !this.addReviewButton;
  }

  hideForm(): void {
    this.addReviewButton = false;
    this.tripForm.reset();
  }

  reserveSeat(): void {
    if (this.trip) {
      if (this.trip.reservedSeats < this.trip.maxSeats) {
        this.trip.reservedSeats++;
        this.cartService.addTrip(this.trip);
      }
    }
  }

  cancelSeat(): void {
    if (this.trip) {
      if (this.trip.reservedSeats > 0) {
        this.trip.reservedSeats--;
        this.cartService.removeTrip(this.trip);
      }
    }
  }
}
