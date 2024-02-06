import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Trip } from '../../assets/interfaces/trip';
import { CurrencyService } from '../services/currency/currency.service';

@Component({
  selector: 'app-trip-card',
  templateUrl: './trip-card.component.html',
  styleUrl: './trip-card.component.css'
})
export class TripCardComponent {
  priceSign: string = '$';
  @Input() trip!: Trip;
  @Input() i!: number;
  @Input() minPrice: number = 0;
  @Input() maxPrice: number = 0;
  @Output() reserveSeatEvent = new EventEmitter<Trip>();
  @Output() cancelSeatEvent = new EventEmitter<Trip>();
  @Output() deleteEvent = new EventEmitter<void>();

  constructor(private currencyService: CurrencyService) { }

  ngOnInit(): void {
    this.currencyService.priceSign$.subscribe((currency: string) => {
      this.priceSign = currency;
    });
  }

  reserveSeat(): void {
    if (this.trip.reservedSeats < this.trip.maxSeats) {
      this.trip.reservedSeats++;
      this.reserveSeatEvent.emit(this.trip);
    }
  }

  cancelSeat(): void {
    if (this.trip.reservedSeats > 0) {
      this.trip.reservedSeats--;
      this.cancelSeatEvent.emit(this.trip);
    }
  }

  handleDelete(): void {
    this.deleteEvent.emit();
  }
}
