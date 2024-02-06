import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripAddComponent } from './trip-add.component';

describe('TripAddComponent', () => {
  let component: TripAddComponent;
  let fixture: ComponentFixture<TripAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TripAddComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TripAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
