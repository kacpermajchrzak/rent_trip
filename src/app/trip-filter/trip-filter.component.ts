import { Component, inject, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TripsService } from '../services/trips/trips.service';

@Component({
  selector: 'app-trip-filter',
  templateUrl: './trip-filter.component.html',
  styleUrl: './trip-filter.component.css'
})
export class TripFilterComponent {
  @Output() filtersChanged = new EventEmitter<any>();
  @Input() minPriceP: number = 0;
  @Input() maxPriceP: number = 0;
  filterForm: FormGroup;
  tripsService: TripsService = inject(TripsService);
  locations: string[] = [];
  ratings: number[] = [1, 2, 3, 4, 5];
  filterVisible: boolean = false;

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      location: [''],
      minPrice: [this.minPriceP],
      maxPrice: [this.maxPriceP],
      startDate: [null],
      endDate: [null],
      rating: [NaN]
    });
    this.tripsService.trips$.subscribe((trips) => {
      this.locations = trips.map((trip) => trip.destination);
    });
  }

  applyFilters(): void {
    this.filtersChanged.emit(this.filterForm.value);
  }
  resetFilters(): void {
    this.filterForm.reset({
      location: '',
      minPrice: this.minPriceP,
      maxPrice: this.maxPriceP,
      startDate: null,
      endDate: null,
      rating: NaN
    });
    this.filtersChanged.emit(this.filterForm.value);
  }
}