import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnrestrictedComponent } from './unrestricted.component';

describe('UnrestrictedComponent', () => {
  let component: UnrestrictedComponent;
  let fixture: ComponentFixture<UnrestrictedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UnrestrictedComponent]
    });
    fixture = TestBed.createComponent(UnrestrictedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
