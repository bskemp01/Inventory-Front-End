import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsSelectionComponent } from './reports-selection.component';

describe('ReportsSelectionComponent', () => {
  let component: ReportsSelectionComponent;
  let fixture: ComponentFixture<ReportsSelectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReportsSelectionComponent]
    });
    fixture = TestBed.createComponent(ReportsSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
