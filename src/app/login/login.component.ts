import { Component } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';


  constructor(private authService: AuthService, private router: Router) { }

  login() {
    this.authService.login(this.email, this.password).then(() => {
      alert('Login successful!');
      this.router.navigate(['/home']);
    }).catch((error) => {
      alert(error.message);
    });
  }
}