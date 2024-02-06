import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripDeleteComponent } from './trip-delete.component';

describe('TripDeleteComponent', () => {
  let component: TripDeleteComponent;
  let fixture: ComponentFixture<TripDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TripDeleteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TripDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
