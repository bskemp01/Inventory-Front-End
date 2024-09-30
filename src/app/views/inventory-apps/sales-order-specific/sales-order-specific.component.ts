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
      plantLocation: new FormControl(
        { value: '', disabled: true },
        Validators.required,
      ),
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
        { value: null, disabled: true },
        Validators.required,
      ),
      material: new FormControl(
        { value: null, disabled: true },
        Validators.required,
      ),
      description: new FormControl({ value: null, disabled: true }),
      quantity: new FormControl(
        { value: null, disabled: true },
        Validators.required,
      ),
      userEntered: new FormControl('', Validators.required),
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
    const sl = formValue.plantLocation === '2810' || '2811' ? '9000' : '1000';

    this.sosTicket = {
      plantLocation: +formValue.plantLocation,
      storageLocation: +sl,
      areaLocation: formValue.areaLocation,
      material: formValue.material,
      ticketNumber: +formValue.ticketNumber,
      salesOrder: +formValue.salesOrder,
      lineItem: formValue.lineItem,
      description: formValue.description,
      quantity: formValue.quantity,
      userEntered: formValue.userEntered,
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
      lineItem: null,
      material: null,
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

      console.log(this.el.nativeElement);
      const element = this.el.nativeElement.querySelector(
        `[formControlName="${fieldName}"]`,
      );

      if (element) {
        setTimeout(() => {
          if (element.tagName.toLowerCase() === 'mat-select') {
            // Open the MatSelect dropdown
            element.click();
          } else if (element instanceof HTMLInputElement) {
            // Set focus if the HTML element is an input
            element.focus();
          } else {
            // Check if the element is a mat-form-field and focus its input
            const inputElement = element.querySelector('input');
            if (inputElement) {
              inputElement.focus();
            }
          }
        }, 0); // Delay to allow the DOM element to be ready
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
    this.lineItems.sort((a, b) => a.value - b.value);
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
            lineItem: foundTicket.lineItem,
            material: foundTicket.material,
            description: foundTicket.description,
            quantity: foundTicket.quantity,
          });
          this.updateTicket = true;
        }
      });
  }

  setDescription(value: number) {
    if (value !== null) {
      let item = value;

      const matchingSalesOrder = this.salesOrderData.find(
        (salesOrder) => salesOrder?.item === item,
      );

      if (matchingSalesOrder) {
        this.salesOrderSpecificForm.patchValue({
          material: matchingSalesOrder.material,
          description: matchingSalesOrder.materialDescription,
        });
      } else {
        this.moveToNextField('material');
        this.salesOrderSpecificForm.patchValue({
          material: null,
          description: 'N/A',
        });
      }
    } else {
      this.salesOrderSpecificForm.patchValue({
        lineItem: null,
        material: null,
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
      lineItem: null,
      material: null,
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
      lineItem: null,
      material: null,
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
    // Subscribe to value changes of userEntered first
    this.salesOrderSpecificForm
      .get('userEntered')!
      .valueChanges.subscribe((userEnteredValue) => {
        const plantLocationControl =
          this.salesOrderSpecificForm.get('plantLocation');

        // Enable plantLocation only when userEntered is filled
        if (userEnteredValue !== null && userEnteredValue !== '') {
          plantLocationControl!.enable();
        } else {
          plantLocationControl!.disable();
        }
      });

    // Subscribe to value changes of plantLocation
    this.salesOrderSpecificForm
      .get('plantLocation')!
      .valueChanges.subscribe((plantLocationValue) => {
        const areaLocationControl =
          this.salesOrderSpecificForm.get('areaLocation');
        const ticketNumberControl =
          this.salesOrderSpecificForm.get('ticketNumber');
        const salesOrderControl = this.salesOrderSpecificForm.get('salesOrder');
        const lineItemControl = this.salesOrderSpecificForm.get('lineItem');
        const materialControl = this.salesOrderSpecificForm.get('material');
        const descriptionControl =
          this.salesOrderSpecificForm.get('description');
        const quantityControl = this.salesOrderSpecificForm.get('quantity');
        const userEnteredValue =
          this.salesOrderSpecificForm.get('userEntered')?.value;

        if (
          plantLocationValue !== '' &&
          userEnteredValue !== null &&
          userEnteredValue !== ''
        ) {
          // Enable other controls when userEntered and plantLocation are filled
          areaLocationControl!.enable();
          ticketNumberControl!.enable();
          salesOrderControl!.enable();
          lineItemControl!.enable();
          materialControl!.enable();
          descriptionControl!.enable();
          quantityControl!.enable();
          // setTimeout(() => {
          //   this.moveToNextField('areaLocation');
          // }, 100);
        } else {
          // Disable other controls when plantLocation or userEntered is empty
          areaLocationControl!.disable();
          ticketNumberControl!.disable();
          salesOrderControl!.disable();
          lineItemControl!.disable();
          materialControl!.disable();
          descriptionControl!.disable();
          quantityControl!.disable();
        }
      });
  }
}
