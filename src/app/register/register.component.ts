import { Component } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { TripsService } from '../services/trips/trips.service';
import { User } from '../../assets/interfaces/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private tripService: TripsService) { }

  register() {
    this.authService.register(this.email, this.password).then(() => {
      this.authService.getCurrentUser1().then(user => {
        if (user) {
          let userObj: User = {
            uid: user.uid,
            email: this.email,
            role: 'user'
          };
          this.tripService.addUser(userObj);
          alert('Registration successful!');
        }
      });
    }).catch((error) => {
      alert(error.message);
    });
  }
}