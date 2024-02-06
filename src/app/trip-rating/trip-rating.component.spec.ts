import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripRatingComponent } from './trip-rating.component';

describe('TripRatingComponent', () => {
  let component: TripRatingComponent;
  let fixture: ComponentFixture<TripRatingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TripRatingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TripRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
