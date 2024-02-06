import { PurchasedService } from './services/purchased/purchased.service';
import { Component } from '@angular/core';
import { CurrencyService } from './services/currency/currency.service';
import { TripsService } from './services/trips/trips.service';
import { CartService } from './services/cart/cart.service';
import { OnInit } from '@angular/core';
import { AuthService } from './services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'tourList';
  tripStartingSoon: boolean = false;
  selectedCurrency: string = '$';
  isLogged: boolean = false;
  userRole: string = 'guest';
  userName: string = '';

  constructor(private tripsService: TripsService, private currencyService: CurrencyService, private cartService: CartService, private purchasedService: PurchasedService, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.isLogged = !!user;
      if (user) {
        this.authService.getUserRole(user.uid).then((role: string) => {
          this.userRole = role;
          this.userName = user.email || '';
        });
      } else {
        this.userRole = 'guest';
      }
    });

    this.purchasedService.fetchPurchased();
    this.purchasedService.tripStartingSoon$.subscribe((value: boolean) => {
      this.tripStartingSoon = value;
    });

    this.currencyService.currencyChanged.subscribe(currency => {
      this.selectedCurrency = currency;
    });
  }

  signOut() {
    this.authService.signOut().then(() => {
      this.router.navigate(['/home']);
      this.cartService.clearCart();
    }).catch((error) => {
      alert('Error signing out: ' + error);
    });
  }

  handleConvertCurrency(event: Event): void {
    let sign = (event.target as HTMLInputElement).value;
    let conversionRate = this.currencyService.convertCurrency(sign);
    this.tripsService.convertCurrency(conversionRate);
    this.cartService.updateCurrency();
    this.purchasedService.updateCurrency(conversionRate);
  }



  setPersistence(event: Event) {
    let persistence: 'local' | 'session' | 'none' = (event.target as HTMLInputElement).value as 'local' | 'session' | 'none';
    this.authService.setPersistence(persistence);
  }
}
