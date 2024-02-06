import { Component, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
@Component({
  selector: 'app-trip-delete',
  templateUrl: './trip-delete.component.html',
  styleUrl: './trip-delete.component.css'
})
export class TripDeleteComponent {
  @Output() delete = new EventEmitter<void>();
  userRole: string = 'guest';

  constructor(private authService: AuthService) {
    this.authService.user$.subscribe(user => {
      if (user) {
        this.authService.getUserRole(user.uid).then((role: string) => {
          this.userRole = role;
        });
      } else {
        this.userRole = 'guest';
      }
    });
  }

  deleteTrip(): void {
    this.delete.emit();
  }
}
