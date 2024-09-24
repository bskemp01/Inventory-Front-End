import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesOrderSpecificComponent } from './sales-order-specific.component';

describe('SalesOrderSpecificComponent', () => {
  let component: SalesOrderSpecificComponent;
  let fixture: ComponentFixture<SalesOrderSpecificComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SalesOrderSpecificComponent]
    });
    fixture = TestBed.createComponent(SalesOrderSpecificComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
