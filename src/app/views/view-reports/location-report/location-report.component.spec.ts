import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationReportComponent } from './location-report.component';

describe('LocationReportComponent', () => {
  let component: LocationReportComponent;
  let fixture: ComponentFixture<LocationReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LocationReportComponent]
    });
    fixture = TestBed.createComponent(LocationReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
