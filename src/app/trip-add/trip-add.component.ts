import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Trip } from '../../assets/interfaces/trip';
import { TripsService } from '../services/trips/trips.service';

@Component({
  selector: 'app-trip-add',
  templateUrl: './trip-add.component.html',
  styleUrls: ['./trip-add.component.css']
})
export class TripAddComponent {

  set trips(trips: Trip[]) {
  }

  tripForm = new FormGroup({
    name: new FormControl('', Validators.required),
    destination: new FormControl('', Validators.required),
    startDate: new FormControl(null, Validators.required),
    endDate: new FormControl(null, Validators.required),
    price: new FormControl(0, [Validators.required, Validators.min(100)]),
    maxSeats: new FormControl(0, [Validators.required, Validators.min(3)]),
    description: new FormControl('', Validators.required),
    image: new FormControl('', Validators.required),
  }, { validators: this.dateLessThan('startDate', 'endDate') });

  dateLessThan(from: string, to: string) {
    return (group: AbstractControl): { [key: string]: any } | null => {
      let f = (group as FormGroup).controls[from];
      let t = (group as FormGroup).controls[to];
      if (f && t && f.value > t.value) {
        return {
          dates: "Date from should be less than Date to"
        };
      }
      return null;
    }
  }

  constructor(private tripsService: TripsService) { }

  ngOnInit(): void {
    this.tripsService.trips$.subscribe((tripList: Trip[]) => {
      this.trips = tripList;
    });
  }

  addTrip(): void {
    if (this.tripForm.valid) {
      const trip: Trip = {
        id: "",
        name: this.tripForm.value.name || '',
        destination: this.tripForm.value.destination || '',
        startDate: this.tripForm.value.startDate || new Date(),
        endDate: this.tripForm.value.endDate || new Date(),
        price: this.tripForm.value.price || 0,
        maxSeats: this.tripForm.value.maxSeats || 0,
        description: this.tripForm.value.description || '',
        image: this.tripForm.value.image || '',
        reservedSeats: 0,
        rating: [0, 0, 0, 0, 0]
      };
      this.tripsService.addTrip(trip);
      this.tripForm.reset();
    }
  }
}