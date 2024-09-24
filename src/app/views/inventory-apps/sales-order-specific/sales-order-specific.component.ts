import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import {
  PlantLocations,
  StorageLocations,
} from 'src/app/const/locations.const';
import { SalesOrderSpecificModel } from 'src/app/models/forms.model';
import { SosTicketModel } from 'src/app/models/year-end-inventory-models/sosTicketModel';
import { SosZmmModel } from 'src/app/models/year-end-inventory-models/sosZmmModel';
import { Subscription } from 'rxjs';
import { YearEndInventoryStateService } from 'src/app/state/year-end-inventory-store.service';
import { YearEndInventoryStoreState } from 'src/app/models/year-end-inventory-store-state.model';
import { distinctUntilChangedWithProp } from 'src/app/utils/equality-utils';
import { SearchSosTicketDialogComponent } from '../../dialog-boxes/search-sos-ticket-dialog/search-sos-ticket-dialog.component';

interface LineItem {
  value: number;
  lineItem: string;
}

@Component({
  selector: 'app-sales-order-specific',
  templateUrl: './sales-order-specific.component.html',
  styleUrls: ['./sales-order-specific.component.scss'],
})
export class SalesOrderSpecificComponent implements OnInit, OnDestroy {
  lineItems: LineItem[] = [];
  plantLocations = PlantLocations;
  storageLocations = StorageLocations;
  salesOrderData: SosZmmModel[] = [];
  saleOrderDataError = false;
  sosTicket!: SosTicketModel;
  updateTicket = false;

  salesOrderSpecificForm!: FormGroup<SalesOrderSpecificModel>;

  private sub = new Subscription();

  constructor(
    private dialog: MatDialog,
    private el: ElementRef,
    private yearEndInventoryService: YearEndInventoryStateService,
  ) {
    this.salesOrderSpecificForm = new FormGroup<SalesOrderSpecificModel>({
      plantLocation: new FormControl('', Validators.required),
      areaLocation: new FormControl(
        { value: null, disabled: true },
        Validators.required,
      ),
      ticketNumber: new FormControl(
        { value: null, disabled: true },
        Validators.required,
      ),
      salesOrder: new FormControl(
        { value: null, disabled: true },
        Validators.required,
      ),
      lineItem: new FormControl(
        { value: '', disabled: true },
        Validators.required,
      ),
      description: new FormControl({ value: null, disabled: true }),
      quantity: new FormControl(
        { value: null, disabled: true },
        Validators.required,
      ),
    });
  }

  ngOnInit(): void {
    this.setFormControls();

    this.sub.add(
      this.yearEndInventoryService.stateChanged
        .pipe(distinctUntilChangedWithProp('saleOrderData'))
        .subscribe((state: YearEndInventoryStoreState) => {
          if (state.saleOrderData.length) {
            this.salesOrderData = state.saleOrderData;
            this.populateLineItems();
          }
        }),
    );

    this.sub.add(
      this.yearEndInventoryService.stateChanged
        .pipe(distinctUntilChangedWithProp('saleOrderDataError'))
        .subscribe((state: YearEndInventoryStoreState) => {
          this.saleOrderDataError = state.saleOrderDataError;
          if (state.saleOrderDataError) {
            this.lineItems = [];
            this.salesOrderData = [];
            this.setDescription(null);
          }
        }),
    );
  }

  addUpdateSosTicket() {
    const formValue = this.salesOrderSpecificForm.value;
    const lineItemArray = formValue.lineItem?.split('-');
    const sl = formValue.plantLocation === '2810' || '2811' ? '9000' : '1000';

    this.sosTicket = {
      plantLocation: +formValue.plantLocation,
      storageLocation: +sl,
      areaLocation: formValue.areaLocation,
      material: lineItemArray.slice(1).join(' ').trim() ?? '',
      ticketNumber: +formValue.ticketNumber,
      salesOrder: +formValue.salesOrder,
      lineItem: +lineItemArray[0].trim() ?? +formValue.lineItem,
      description: formValue.description,
      quantity: formValue.quantity,
      userEntered: 'N/A',
    };

    if (this.updateTicket) {
      this.yearEndInventoryService.updateSosTicket(this.sosTicket);
    } else {
      this.yearEndInventoryService.addSosTicket(this.sosTicket);
    }
    this.nextEntry();
    this.moveToNextField('areaLocation');
  }

  changePlant() {
    this.salesOrderSpecificForm.patchValue({
      areaLocation: null,
      ticketNumber: null,
      salesOrder: null,
      lineItem: '',
      description: null,
      quantity: null,
    });
    this.lineItems = [];
    this.salesOrderData = [];
    this.updateTicket = false;
    this.yearEndInventoryService.clearAllStates();
    this.moveToNextField('areaLocation');
  }

  getSalesOrderData(): void {
    if (this.salesOrderSpecificForm.get('salesOrder')?.value!) {
      this.yearEndInventoryService.getSalesOrderData(
        this.salesOrderSpecificForm.get('salesOrder')?.value!,
      );
    }
  }

  isClearButtonDisabled(): boolean {
    // Check if any field in the form has a value
    return Object.values(this.salesOrderSpecificForm.value).every(
      (value) => value === null || value === '',
    );
  }

  moveToNextField(fieldName: string): void {
    const nextField = this.salesOrderSpecificForm.get(fieldName);
    if (nextField) {
      nextField.markAsTouched();

      const element = this.el.nativeElement.querySelector(
        `[formControlName="${fieldName}"]`,
      );

      if (element) {
        if (element.tagName.toLowerCase() === 'mat-select') {
          // Open the MatSelect dropdown
          element.click(); // You can use other methods like 'dispatchEvent' if 'click' doesn't work
        } else if (element instanceof HTMLInputElement) {
          // Set focus if the HTML element is an input
          element.focus();
        }
      }
    }
  }

  populateLineItems() {
    this.salesOrderData.map((salesOrder) => {
      this.lineItems.push({
        value: salesOrder.item!,
        lineItem: `${salesOrder.item} - ${salesOrder.material}`,
      });
    });
    this.moveToNextField('lineItem');
  }

  searchSosTicket() {
    this.yearEndInventoryService.clearAllStates();
    this.dialog
      .open(SearchSosTicketDialogComponent, {
        disableClose: true,
        id: 'SearchSosTicketDialog',
        width: '700px',
      })
      .afterClosed()
      .subscribe((foundTicket: SosTicketModel) => {
        if (foundTicket) {
          this.salesOrderSpecificForm.patchValue({
            plantLocation: foundTicket.plantLocation?.toString(),
            areaLocation: foundTicket.areaLocation,
            ticketNumber: foundTicket.ticketNumber?.toString(),
            salesOrder: foundTicket.salesOrder,
            lineItem: `${foundTicket.lineItem} - ${foundTicket.material}`,
            description: foundTicket.description,
            quantity: foundTicket.quantity,
          });
          this.updateTicket = true;
        }
      });
  }

  setDescription(value: string) {
    if (value !== null) {
      let item = value.trim(); // Initialize with the trimmed value
      // Check if the value contains a '-'
      if (value.includes('-')) {
        const itemParts = value.split('-'); // Split the value by '-'
        item = itemParts[0].trim(); // Get the first part and trim whitespaces
      }

      const matchingSalesOrder = this.salesOrderData.find(
        (salesOrder) => salesOrder.item?.toString() === item,
      );

      if (matchingSalesOrder) {
        this.salesOrderSpecificForm.patchValue({
          description: matchingSalesOrder.materialDescription,
        });
      } else {
        this.salesOrderSpecificForm.patchValue({
          description: 'N/A',
        });
      }
    } else {
      this.salesOrderSpecificForm.patchValue({
        lineItem: '',
        description: null,
      });
    }
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  //**************************************************************
  //  only form reset code below this line
  //**************************************************************

  clearForm() {
    this.salesOrderSpecificForm.reset({
      plantLocation: '',
      areaLocation: null,
      ticketNumber: null,
      salesOrder: null,
      lineItem: '',
      description: null,
      quantity: null,
    });
    this.lineItems = [];
    this.salesOrderData = [];
    this.updateTicket = false;
    this.yearEndInventoryService.clearAllStates();
  }

  nextEntry() {
    this.salesOrderSpecificForm.patchValue({
      areaLocation: null,
      ticketNumber: null,
      salesOrder: null,
      lineItem: '',
      description: null,
      quantity: null,
    });
    this.lineItems = [];
    this.salesOrderData = [];
    this.updateTicket = false;
    this.yearEndInventoryService.clearAllStates();
  }

  //**************************************************************
  //  only form control setup code below this line
  //**************************************************************

  setFormControls() {
    this.salesOrderSpecificForm
      .get('plantLocation')!
      .valueChanges.subscribe((plantLocationValue) => {
        const areaLocationControl =
          this.salesOrderSpecificForm.get('areaLocation');
        const ticketNumberControl =
          this.salesOrderSpecificForm.get('ticketNumber');
        const salesOrderControl = this.salesOrderSpecificForm.get('salesOrder');
        const lineItemControl = this.salesOrderSpecificForm.get('lineItem');
        const descriptionControl =
          this.salesOrderSpecificForm.get('description');
        const quantityControl = this.salesOrderSpecificForm.get('quantity');

        if (plantLocationValue !== '') {
          // Enable other controls when plantLocation and storageLocationValue is filled
          areaLocationControl!.enable();
          ticketNumberControl!.enable();
          salesOrderControl!.enable();
          lineItemControl!.enable();
          descriptionControl!.enable();
          quantityControl!.enable();
          setTimeout(() => {
            this.moveToNextField('areaLocation');
          }, 100);
        } else {
          // Disable other controls when plantLocation is empty
          areaLocationControl!.disable();
          ticketNumberControl!.disable();
          salesOrderControl!.disable();
          lineItemControl!.disable();
          descriptionControl!.disable();
          quantityControl!.disable();
        }
      });
  }
}
