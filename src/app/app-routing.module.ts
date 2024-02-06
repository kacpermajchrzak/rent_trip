import { TripsComponent } from './trips/trips.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { PurchasedTripsComponent } from './purchased-trips/purchased-trips.component';
import { TripAddComponent } from './trip-add/trip-add.component';
import { HomeComponent } from './home/home.component';
import { TripDetailsComponent } from './trip-details/trip-details.component';
import { AuthGuard } from './guard/auth.guard';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { AdminGuard } from './guards/admin.guard';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'cart', component: ShoppingCartComponent, canActivate: [AuthGuard] },
  { path: 'purchased', component: PurchasedTripsComponent, canActivate: [AuthGuard] },
  { path: 'trips', component: TripsComponent },
  { path: 'add', component: TripAddComponent, canActivate: [AdminGuard] },
  { path: 'home', component: HomeComponent },
  { path: 'trips/:id', component: TripDetailsComponent, canActivate: [AuthGuard] },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
