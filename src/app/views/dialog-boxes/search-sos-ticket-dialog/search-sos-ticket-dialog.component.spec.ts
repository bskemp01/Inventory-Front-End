import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchSosTicketDialogComponent } from './search-sos-ticket-dialog.component';

describe('SearchSosTicketDialogComponent', () => {
  let component: SearchSosTicketDialogComponent;
  let fixture: ComponentFixture<SearchSosTicketDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SearchSosTicketDialogComponent]
    });
    fixture = TestBed.createComponent(SearchSosTicketDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
