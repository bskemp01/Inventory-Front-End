import { Component, ElementRef, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { SalesOrderSpecificModel } from 'src/app/models/forms.model';
import { SosTicketModel } from 'src/app/models/year-end-inventory-models/sosTicketModel';
import { YearEndInventoryStoreState } from 'src/app/models/year-end-inventory-store-state.model';
import { YearEndInventoryStateService } from 'src/app/state/year-end-inventory-store.service';
import { distinctUntilChangedWithProp } from 'src/app/utils/equality-utils';

@Component({
  selector: 'app-search-sos-ticket-dialog',
  templateUrl: './search-sos-ticket-dialog.component.html',
  styleUrls: ['./search-sos-ticket-dialog.component.scss'],
})
export class SearchSosTicketDialogComponent implements OnInit  {
  lineItems!: string[];
  searchCriteria!: SosTicketModel;
  searchCriteriaForm!: FormGroup<SalesOrderSpecificModel>;
  searchedSalesOrder!: SosTicketModel;

  private sub = new Subscription();

  constructor(
    public dialogRef: MatDialogRef<SearchSosTicketDialogComponent>,
    private el: ElementRef,
    private yearEndInventoryService: YearEndInventoryStateService,
  ) {
    this.searchCriteriaForm = new FormGroup<SalesOrderSpecificModel>({
      ticketNumber: new FormControl(null, Validators.required),
      salesOrder: new FormControl(null, Validators.required),
      lineItem: new FormControl(null, Validators.required),
    });
  }

  ngOnInit(): void {
    this.sub.add(
      this.yearEndInventoryService.stateChanged
        .pipe(distinctUntilChangedWithProp('lineItems'))
        .subscribe((state: YearEndInventoryStoreState) => {
          if (state.lineItems.length) {
            this.lineItems = state.lineItems;
          }
        }),
    );

    this.sub.add(
      this.yearEndInventoryService.stateChanged
        .pipe(distinctUntilChangedWithProp('searchedSalesOrder'))
        .subscribe((state: YearEndInventoryStoreState) => {
          if (state.searchedSalesOrder.ticketNumber) {
            this.searchedSalesOrder = state.searchedSalesOrder;
            this.dialogRef.close(this.searchedSalesOrder);
          }
        }),
    );
  }

  cancel() {
    this.dialogRef.close();
  }

  getLineItems() {
    if (this.searchCriteriaForm.get('salesOrder')?.value) {
      this.yearEndInventoryService.getLineItems(
        this.searchCriteriaForm.get('salesOrder')?.value!,
      );
      this.moveToNextField('lineItem');
    }
  }

  moveToNextField(fieldName: string): void {
    const nextField = this.searchCriteriaForm.get(fieldName);
    if (nextField) {
      nextField.markAsTouched();

      const element = this.el.nativeElement.querySelector(
        `[formControlName="${fieldName}"]`,
      );

      if (element instanceof HTMLInputElement) {
        // Set focus if the HTML element is an input
        element.focus();
      }
    }
  }

  searchForEntry() {
    this.searchCriteria = {
      ticketNumber: +this.searchCriteriaForm.get('ticketNumber')?.value!,
      salesOrder: this.searchCriteriaForm.get('salesOrder')?.value!,
      lineItem: +this.searchCriteriaForm.get('lineItem')?.value!,
    };

    this.yearEndInventoryService.getSosTicket(this.searchCriteria);
  }
}
