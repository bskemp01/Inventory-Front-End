import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchUnrestrictedTicketDialogComponent } from './search-unrestricted-ticket-dialog.component';

describe('SearchUnrestrictedTicketDialogComponent', () => {
  let component: SearchUnrestrictedTicketDialogComponent;
  let fixture: ComponentFixture<SearchUnrestrictedTicketDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SearchUnrestrictedTicketDialogComponent]
    });
    fixture = TestBed.createComponent(SearchUnrestrictedTicketDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
