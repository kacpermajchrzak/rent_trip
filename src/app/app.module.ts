import { AngularFireModule } from "@angular/fire/compat";
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from "../environment/environment";
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TripsComponent } from './trips/trips.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TripDeleteComponent } from './trip-delete/trip-delete.component';
import { TripAddComponent } from './trip-add/trip-add.component';
import { TripRatingComponent } from './trip-rating/trip-rating.component';

import { LocationPipe } from './pipes/location.pipe';
import { PricePipe } from './pipes/price.pipe';
import { DatePipe } from './pipes/date.pipe';
import { RatingPipe } from './pipes/rating.pipe';
import { TripFilterComponent } from './trip-filter/trip-filter.component';
import { TripCardComponent } from './trip-card/trip-card.component';
import { SelectedTripSummaryComponent } from './selected-trip-summary/selected-trip-summary.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { PurchasedTripsComponent } from './purchased-trips/purchased-trips.component';
import { FilterTripsPipe } from './pipes/filter-trips.pipe';
import { HomeComponent } from './home/home.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { TripDetailsComponent } from './trip-details/trip-details.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';



@NgModule({
  declarations: [
    AppComponent,
    TripsComponent,
    TripDeleteComponent,
    TripAddComponent,
    TripRatingComponent,
    LocationPipe,
    PricePipe,
    DatePipe,
    RatingPipe,
    TripFilterComponent,
    TripCardComponent,
    SelectedTripSummaryComponent,
    ShoppingCartComponent,
    PurchasedTripsComponent,
    FilterTripsPipe,
    HomeComponent,
    TripDetailsComponent,
    RegisterComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    LeafletModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
