import { Component, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-trip-rating',
  templateUrl: './trip-rating.component.html',
  styleUrls: ['./trip-rating.component.css']
})
export class TripRatingComponent {
  @Output() rate = new EventEmitter<number>();
  @Input() stars!: boolean[];

  rateTrip(index: number): void {
    this.stars = Array(5).fill(false);
    for (let i = 0; i <= index; i++) {
      this.stars[i] = true;
    }
    this.rate.emit(index + 1);
  }
}