import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { UnrestrictedModel } from 'src/app/models/forms.model';
import { UnrestrictedTicketModel } from 'src/app/models/year-end-inventory-models/unrestrictedTicketModel';
import { YearEndInventoryStoreState } from 'src/app/models/year-end-inventory-store-state.model';
import { YearEndInventoryStateService } from 'src/app/state/year-end-inventory-store.service';
import { distinctUntilChangedWithProp } from 'src/app/utils/equality-utils';

@Component({
  selector: 'app-search-unrestricted-ticket-dialog',
  templateUrl: './search-unrestricted-ticket-dialog.component.html',
  styleUrls: ['./search-unrestricted-ticket-dialog.component.scss'],
})
export class SearchUnrestrictedTicketDialogComponent implements OnInit  {
  isLoading$ = this.yearEndInventoryService.isLoading$;

  searchCriteriaForm!: FormGroup<UnrestrictedModel>;
  searchedUnrestrictedTicket!: UnrestrictedTicketModel;

  private sub = new Subscription();

  constructor(
    public dialogRef: MatDialogRef<SearchUnrestrictedTicketDialogComponent>,
    private yearEndInventoryService: YearEndInventoryStateService,
  ) {
    this.searchCriteriaForm = new FormGroup<UnrestrictedModel>({
      ticketNumber: new FormControl(null, Validators.required),
    });
  }

  ngOnInit(): void {

    this.sub.add(
      this.yearEndInventoryService.stateChanged
        .pipe(distinctUntilChangedWithProp('searchedUnrestrictedTicket'))
        .subscribe((state: YearEndInventoryStoreState) => {
          if (state.searchedUnrestrictedTicket.ticketNumber) {
            this.searchedUnrestrictedTicket = state.searchedUnrestrictedTicket;
            this.dialogRef.close(this.searchedUnrestrictedTicket);
          }
        }),
    );
  }

  cancel() {
    this.dialogRef.close();
  }

  searchForEntry() {
    const formValue = this.searchCriteriaForm.value;

    this.yearEndInventoryService.getUnrestrictedTicket(+formValue.ticketNumber!);
  }
}
