import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import {
  PlantLocations,
  StorageLocations,
} from 'src/app/const/locations.const';
import { UnrestrictedModel } from 'src/app/models/forms.model';
import { UnrestrictedTicketModel } from 'src/app/models/year-end-inventory-models/unrestrictedTicketModel';
import { UnrestrictedZmmModel } from 'src/app/models/year-end-inventory-models/unrestrictedZmmModel';
import { YearEndInventoryStoreState } from 'src/app/models/year-end-inventory-store-state.model';
import { YearEndInventoryStateService } from 'src/app/state/year-end-inventory-store.service';
import { SearchUnrestrictedTicketDialogComponent } from '../../dialog-boxes/search-unrestricted-ticket-dialog/search-unrestricted-ticket-dialog.component';
import { Subscription } from 'rxjs';
import { distinctUntilChangedWithProp } from 'src/app/utils/equality-utils';
import { ActiveListData } from 'src/app/models/year-end-inventory-models/activeListData';

@Component({
  selector: 'app-unrestricted',
  templateUrl: './unrestricted.component.html',
  styleUrls: ['./unrestricted.component.scss'],
})
export class UnrestrictedComponent implements OnInit, OnDestroy {
  plantLocations = PlantLocations;
  storageLocations = StorageLocations;
  updateTicket = false;
  unrestrictedRowData!: ActiveListData;
  unrestrictedRowDataError = false;
  unrestrictedTicket!: UnrestrictedTicketModel;

  unrestrictedForm!: FormGroup<UnrestrictedModel>;

  private sub = new Subscription();

  constructor(
    private dialog: MatDialog,
    private el: ElementRef,
    private yearEndInventoryService: YearEndInventoryStateService,
  ) {
    this.unrestrictedForm = new FormGroup<UnrestrictedModel>({
      plantLocation: new FormControl(
        { value: '', disabled: true },
        Validators.required,
      ),
      storageLocation: new FormControl(
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
      partNumber: new FormControl(
        { value: null, disabled: true },
        Validators.required,
      ),
      description: new FormControl(
        { value: null, disabled: true },
        Validators.required,
      ),
      unitOfMeasure: new FormControl(
        { value: null, disabled: true },
        Validators.required,
      ),
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
        .pipe()
        .subscribe((state: YearEndInventoryStoreState) => {
          if (state.unrestrictedRowData.material) {
            this.unrestrictedRowData = state.unrestrictedRowData;
            this.setDescription();
          }
        }),
    );

    this.sub.add(
      this.yearEndInventoryService.stateChanged
        .pipe(distinctUntilChangedWithProp('unrestrictedRowDataError'))
        .subscribe((state: YearEndInventoryStoreState) => {
          this.unrestrictedRowDataError = state.unrestrictedRowDataError;
          if (state.unrestrictedRowDataError) {
            this.unrestrictedRowData = {};
            this.unrestrictedRowData = {
              materialDescription: null,
              altUnitOfMeasure: null,
            };
            this.setDescription();
          }
        }),
    );
  }

  addUnrestrictedTicket() {
    if (this.unrestrictedForm.invalid) {
      // Optionally, mark all fields as touched to trigger validation messages
      this.unrestrictedForm.markAllAsTouched();
      return; // Stop the method if the form is invalid
    }

    const formValue = this.unrestrictedForm.value;

    this.unrestrictedTicket = {
      ticketNumber: +formValue.ticketNumber!,
      partNumber: formValue.partNumber!,
      storageLocation: +formValue.storageLocation!,
      description: formValue.description!,
      unitOfMeasure: formValue.unitOfMeasure!,
      quantity: formValue.quantity!,
      plantLocation: +formValue.plantLocation!,
      areaLocation: formValue.areaLocation!,
      userEntered: formValue.userEntered,
    };

    if (this.updateTicket) {
      this.yearEndInventoryService.updateUnrestrictedTicket(
        this.unrestrictedTicket,
      );
    } else {
      this.yearEndInventoryService.addUnrestrictedTicket(
        this.unrestrictedTicket,
      );
    }
    this.nextEntry();
    this.moveToNextField('areaLocation');
  }

  changePlant() {
    this.unrestrictedForm.patchValue({
      storageLocation: '',
      areaLocation: null,
      ticketNumber: null,
      partNumber: null,
      description: '',
      unitOfMeasure: null,
      quantity: null,
    });
    this.unrestrictedRowData = {};
    this.updateTicket = false;
    this.yearEndInventoryService.clearAllStates();
    this.moveToNextField('storageLocation');
  }

  getUnrestrictedRowData() {
    const formValue = this.unrestrictedForm.value;

    if (formValue.partNumber) {
      this.yearEndInventoryService.getUnrestrictedRowData(
        formValue.partNumber.toString(),
      );
    }
  }

  isClearButtonDisabled(): boolean {
    // Check if any field in the form has a value
    return Object.values(this.unrestrictedForm.value).every(
      (value) => value === null || value === '',
    );
  }

  moveToNextField(fieldName: string): void {
    const nextField = this.unrestrictedForm.get(fieldName);
    if (nextField) {
      nextField.markAsTouched();

      const element = this.el.nativeElement.querySelector(
        `[formControlName="${fieldName}"]`,
      );

      if (element) {
        setTimeout(() => {
          if (element.tagName.toLowerCase() === 'mat-select') {
            // Open the MatSelect dropdown
            element.click(); // You can use other methods like 'dispatchEvent' if 'click' doesn't work
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
        }, 0); // Delay ensures DOM element is ready
      }
    }
  }

  searchUnrestrictedTicket() {
    this.yearEndInventoryService.clearAllStates();
    this.dialog
      .open(SearchUnrestrictedTicketDialogComponent, {
        disableClose: true,
        id: 'SearchUnrestrictedTicketDialog',
        width: '700px',
      })
      .afterClosed()
      .subscribe((foundTicket: UnrestrictedTicketModel) => {
        if (foundTicket) {
          this.unrestrictedForm.patchValue({
            plantLocation: foundTicket.plantLocation?.toString(),
            storageLocation: foundTicket.storageLocation?.toString(),
            areaLocation: foundTicket.areaLocation,
            ticketNumber: foundTicket.ticketNumber?.toString(),
            partNumber: foundTicket.partNumber,
            description: foundTicket.description,
            unitOfMeasure: foundTicket.unitOfMeasure,
            quantity: foundTicket.quantity,
          });
          this.updateTicket = true;
        }
      });
  }

  setDescription() {
    this.unrestrictedForm.patchValue({
      description: this.unrestrictedRowData.materialDescription,
      unitOfMeasure: this.unrestrictedRowData.altUnitOfMeasure,
    });
    this.moveToNextField('quantity');
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  //**************************************************************
  //  only form reset code below this line
  //**************************************************************

  clearForm() {
    this.unrestrictedForm.reset({
      plantLocation: '',
      storageLocation: '',
      areaLocation: null,
      ticketNumber: null,
      partNumber: null,
      description: '',
      unitOfMeasure: null,
      quantity: null,
    });
    this.unrestrictedRowData = {};
    this.updateTicket = false;
    this.yearEndInventoryService.clearAllStates();
  }

  nextEntry() {
    this.unrestrictedForm.patchValue({
      areaLocation: null,
      ticketNumber: null,
      partNumber: null,
      description: '',
      unitOfMeasure: null,
      quantity: null,
    });
    this.unrestrictedRowData = {};
    this.updateTicket = false;
    this.yearEndInventoryService.clearAllStates();
  }

  //**************************************************************
  //  only form control setup code below this line
  //**************************************************************

  setFormControls() {
    this.unrestrictedForm
      .get('userEntered')!
      .valueChanges.subscribe((userEnteredValue) => {
        const plantLocationControl = this.unrestrictedForm.get('plantLocation');
        const storageLocationControl =
          this.unrestrictedForm.get('storageLocation');

        // Enable plantLocation and storageLocation only when userEntered is filled
        if (userEnteredValue !== null && userEnteredValue !== '') {
          plantLocationControl!.enable();
          storageLocationControl!.enable();
        } else {
          plantLocationControl!.disable();
          storageLocationControl!.disable();
        }
      });

    this.unrestrictedForm
      .get('plantLocation')!
      .valueChanges.subscribe((plantLocationValue) => {
        const storageLocationValue =
          this.unrestrictedForm.get('storageLocation')?.value;
        const userEnteredValue =
          this.unrestrictedForm.get('userEntered')?.value;
        const areaLocationControl = this.unrestrictedForm.get('areaLocation');
        const ticketNumberControl = this.unrestrictedForm.get('ticketNumber');
        const partNumberControl = this.unrestrictedForm.get('partNumber');
        const descriptionControl = this.unrestrictedForm.get('description');
        const unitOfMeasureControl = this.unrestrictedForm.get('unitOfMeasure');
        const quantityControl = this.unrestrictedForm.get('quantity');

        if (
          plantLocationValue !== '' &&
          storageLocationValue !== '' &&
          userEnteredValue !== null &&
          userEnteredValue !== ''
        ) {
          // Enable other controls when plantLocation, storageLocation, and userEntered are filled
          areaLocationControl!.enable();
          ticketNumberControl!.enable();
          partNumberControl!.enable();
          descriptionControl!.enable();
          unitOfMeasureControl!.enable();
          quantityControl!.enable();
        } else {
          // Disable other controls when plantLocation, storageLocation, or userEntered is empty
          areaLocationControl!.disable();
          ticketNumberControl!.disable();
          partNumberControl!.disable();
          descriptionControl!.disable();
          unitOfMeasureControl!.disable();
          quantityControl!.disable();
        }
      });

    this.unrestrictedForm
      .get('storageLocation')!
      .valueChanges.subscribe((storageLocationValue) => {
        const plantLocationValue =
          this.unrestrictedForm.get('plantLocation')?.value;
        const userEnteredValue =
          this.unrestrictedForm.get('userEntered')?.value;
        const areaLocationControl = this.unrestrictedForm.get('areaLocation');
        const ticketNumberControl = this.unrestrictedForm.get('ticketNumber');
        const partNumberControl = this.unrestrictedForm.get('partNumber');
        const descriptionControl = this.unrestrictedForm.get('description');
        const unitOfMeasureControl = this.unrestrictedForm.get('unitOfMeasure');
        const quantityControl = this.unrestrictedForm.get('quantity');

        if (
          storageLocationValue !== '' &&
          plantLocationValue !== '' &&
          userEnteredValue !== null &&
          userEnteredValue !== ''
        ) {
          // Enable other controls when plantLocation, storageLocation, and userEntered are filled
          areaLocationControl!.enable();
          ticketNumberControl!.enable();
          partNumberControl!.enable();
          descriptionControl!.enable();
          unitOfMeasureControl!.enable();
          quantityControl!.enable();
          // setTimeout(() => {
          //   this.moveToNextField('areaLocation');
          // }, 100);
        } else {
          // Disable other controls when plantLocation, storageLocation, or userEntered is empty
          areaLocationControl!.disable();
          ticketNumberControl!.disable();
          partNumberControl!.disable();
          descriptionControl!.disable();
          unitOfMeasureControl!.disable();
          quantityControl!.disable();
        }
      });
  }
}
