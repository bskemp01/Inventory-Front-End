import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { PlantLocations } from 'src/app/const/locations.const';
import {
  ReportTypes,
  Reports,
  ReportsEnum,
} from 'src/app/const/reportOptions.const';
import { ReportsForm } from 'src/app/models/forms.model';
import { YearEndInventoryStateService } from 'src/app/state/year-end-inventory-store.service';

@Component({
  selector: 'app-reports-selection',
  templateUrl: './reports-selection.component.html',
  styleUrls: ['./reports-selection.component.scss'],
})
export class ReportsSelectionComponent {
  plantLocations = PlantLocations;
  reportTypes = ReportTypes;
  reports = Reports;

  reportsForm!: FormGroup<ReportsForm>;

  constructor(
    public dialogRef: MatDialogRef<ReportsSelectionComponent>,
    private yearEndInventoryService: YearEndInventoryStateService,
  ) {
    this.reportsForm = new FormGroup<ReportsForm>({
      reportType: new FormControl('', Validators.required),
      report: new FormControl('', Validators.required),
      plant: new FormControl('', Validators.required),
      min: new FormControl(null, Validators.required),
      max: new FormControl(null, Validators.required),
      fileName: new FormControl('', Validators.required),
    });
  }

  cancel() {
    this.dialogRef.close();
  }

  download() {
    const formValue = this.reportsForm.value;
    if (formValue.report === 'UR') {
      this.yearEndInventoryService.getUploadReport(
        formValue.reportType!,
        +formValue.plant!,
        formValue.fileName!,
        true,
      );
    }
    if (formValue.report === 'ATER') {
      this.yearEndInventoryService.getAllTicketEntriesReport(
        formValue.reportType!,
        +formValue.plant!,
        formValue.fileName!,
        true,
      );
    }
    if (formValue.report === 'DR') {
      this.yearEndInventoryService.getDifferenceReport(
        formValue.reportType!,
        +formValue.plant!,
        formValue.fileName!,
        true,
      );
    }
    if (formValue.report === 'MTR') {
      this.yearEndInventoryService.getMissingTicketReport(
        formValue.reportType!,
        +formValue.plant!,
        formValue.min!,
        formValue.max!,
        formValue.fileName!,
        true,
      );
    }
    this.dialogRef.close();
  }

  isDownloadDisabled(): boolean {
    const formValue = this.reportsForm.value;
    if (formValue.report === 'MTR') {
      return !(
        formValue.reportType &&
        formValue.report &&
        formValue.plant &&
        formValue.min &&
        formValue.max &&
        formValue.fileName
      );
    } else {
      return !(
        formValue.reportType &&
        formValue.report &&
        formValue.plant &&
        formValue.fileName
      );
    }
  }

  updateDefaultFileName() {
    const formValue = this.reportsForm.value;
    let fileName = '';
    if (formValue.reportType !== '') {
      fileName = formValue.reportType!;
    }
    if (formValue.report !== '') {
      const temp = this.getReport();
      fileName += `_${temp!.replaceAll(' ', '_')}`;
    }
    if (formValue.plant !== '') {
      fileName += `_${formValue.plant}`;
    }

    this.reportsForm.patchValue({
      fileName: fileName,
    });
  }

  private getReport() {
    switch (this.reportsForm.get('report')?.value) {
      case 'ATER':
        return ReportsEnum.ATER;
      case 'DR':
        return ReportsEnum.DR;
      case 'MTR':
        return ReportsEnum.MTR;
      case 'UR':
        return ReportsEnum.UR;
      default:
        return undefined;
    }
  }
}
