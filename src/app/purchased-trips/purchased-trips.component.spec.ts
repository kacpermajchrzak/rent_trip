import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchasedTripsComponent } from './purchased-trips.component';

describe('PurchasedTripsComponent', () => {
  let component: PurchasedTripsComponent;
  let fixture: ComponentFixture<PurchasedTripsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PurchasedTripsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PurchasedTripsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
