import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedTripSummaryComponent } from './selected-trip-summary.component';

describe('SelectedTripSummaryComponent', () => {
  let component: SelectedTripSummaryComponent;
  let fixture: ComponentFixture<SelectedTripSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectedTripSummaryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SelectedTripSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
