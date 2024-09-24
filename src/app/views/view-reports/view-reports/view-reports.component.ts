/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-prototype-builtins */
import { Component, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PlantLocations } from 'src/app/const/locations.const';
import { ReportTypes, Reports } from 'src/app/const/reportOptions.const';
import { ReportsForm } from 'src/app/models/forms.model';
import { YearEndInventoryStoreState } from 'src/app/models/year-end-inventory-store-state.model';
import { YearEndInventoryStateService } from 'src/app/state/year-end-inventory-store.service';
import { distinctUntilChangedWithProp } from 'src/app/utils/equality-utils';
import {
  ColDef,
  GridReadyEvent,
  GridOptions,
  GridApi,
  FilterModel,
  ITextFilterParams,
  RowClickedEvent,
  INumberFilterParams,
} from 'ag-grid-community';
import { downloadToXLSX } from 'src/app/utils/convert-to-xlsx.utils';
@Component({
  selector: 'app-view-reports',
  templateUrl: './view-reports.component.html',
  styleUrls: ['./view-reports.component.scss'],
})
export class ViewReportsComponent implements OnDestroy {
  columnDefs: ColDef[] = [];
  gridApi!: GridApi;
  gridOptions: GridOptions = { rowData: [] };
  plantLocations = PlantLocations;
  reportData: string[] = [];
  reportFields = [
    'Ticket Number',
    'Plant Location',
    'Storage Location',
    'Sales Order',
    'Line Item',
    'Quantity',
    'line Item',
    'Counted',
    'SAP Count',
    'Difference',
    'TicketNumber',
  ];
  reportTypes = ReportTypes;
  reports = Reports;

  reportsForm!: FormGroup<ReportsForm>;

  private sub = new Subscription();

  constructor(private yearEndInventoryService: YearEndInventoryStateService) {
    this.reportsForm = new FormGroup<ReportsForm>({
      reportType: new FormControl('', Validators.required),
      report: new FormControl('', Validators.required),
      plant: new FormControl('', Validators.required),
      min: new FormControl(null, Validators.required),
      max: new FormControl(null, Validators.required),
      fileName: new FormControl('', Validators.required),
    });
  }

  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;
    this.sub.add(
      this.yearEndInventoryService.stateChanged
        .pipe(distinctUntilChangedWithProp('reportData'))
        .subscribe((state: YearEndInventoryStoreState) => {
          if (state.reportData.length) {
            this.reportData = state.reportData;
            this.gridApi.setGridOption('columnDefs', this.getColumnNames());
            this.gridApi.setGridOption('rowData', this.reportData);
          }
        }),
    );
  }

  isViewReportsDisabled(): boolean {
    const formValue = this.reportsForm.value;
    if (formValue.report === 'MTR') {
      return !(
        formValue.reportType &&
        formValue.report &&
        formValue.plant &&
        formValue.min &&
        formValue.max
      );
    } else {
      return !(formValue.reportType && formValue.report && formValue.plant);
    }
  }

  downloadTable() {
    const formValue = this.reportsForm.value;
    const fileName = `${formValue.reportType}_${formValue.report}_${formValue.plant}_Filtered`;
    const filterModel: FilterModel = this.gridApi.getFilterModel();

    let filteredData = [...this.reportData];

    for (const field in filterModel) {
      if (filterModel.hasOwnProperty(field)) {
        const filter = filterModel[field];
        const type = filter.type;
        const filterValue = filter.filter;

        // Apply filter based on the type
        if (type === 'contains') {
          filteredData = filteredData.filter((item) =>
            item[field as any].includes(filterValue),
          );
        } else if (type === 'equals') {
          filteredData = filteredData.filter(
            (item) => item[field as any] === filterValue,
          );
        } else if (type === 'startsWith') {
          filteredData = filteredData.filter((item) =>
            item[field as any].startsWith(filterValue),
          );
        } else if (type === 'endsWith') {
          filteredData = filteredData.filter((item) =>
            item[field as any].endsWith(filterValue),
          );
        }
      }
    }

    downloadToXLSX(filteredData, fileName);
  }

  getColumnNames() {
    const colDef: ColDef[] = [];
    const numberSort = (num1: number, num2: number) => {
      return num1 - num2;
    };
    Object.keys(this.reportData[0]).forEach((key) => {
      const col: ColDef = {
        field: key,
        filter: true,
        filterParams: {
          buttons: ['reset', 'apply'],
          closeOnApply: true,
          maxNumConditions: 1,
          filterOptions: [
            'contains',
            'startsWith',
            'endsWith',
            'equals',
            'notEqual',
            'greaterThan',
            'greaterThanOrEqual',
            'lessThan',
            'lessThanOrEqual',
            'inRange',
          ],
        },
        flex: 1,
        headerName: key,
        resizable: true,
        suppressMovable: true,
      };

      if (this.reportFields.includes(key)) {
        col.comparator = numberSort;
      }

      colDef.push(col);
    });

    return colDef;
  }

  rowClicked(event: RowClickedEvent) {
    console.log(event);
  }

  viewReport() {
    const formValue = this.reportsForm.value;
    if (formValue.report === 'UR') {
      this.yearEndInventoryService.getUploadReport(
        formValue.reportType!,
        +formValue.plant!,
      );
    }
    if (formValue.report === 'ATER') {
      this.yearEndInventoryService.getAllTicketEntriesReport(
        formValue.reportType!,
        +formValue.plant!,
      );
    }
    if (formValue.report === 'DR') {
      this.yearEndInventoryService.getDifferenceReport(
        formValue.reportType!,
        +formValue.plant!,
      );
    }
    if (formValue.report === 'MTR') {
      this.yearEndInventoryService.getMissingTicketReport(
        formValue.reportType!,
        +formValue.plant!,
        formValue.min!,
        formValue.max!,
      );
    }
  }

  ngOnDestroy(): void {
    this.reportData = [];
    this.gridApi = null;
    this.yearEndInventoryService.clearAllStates();
    this.sub.unsubscribe();
  }
}
