import { Injectable } from '@angular/core';
import { YearEndInventoryStoreState } from '../models/year-end-inventory-store-state.model';
import { ApiService } from '../services/api/api.service';
import { NotificationService } from '../services/notification/notifications.service';
import { ObservableStore } from '@codewithdan/observable-store';
import { SosTicketModel } from '../models/year-end-inventory-models/sosTicketModel';
import { BehaviorSubject, EMPTY, catchError, forkJoin } from 'rxjs';
import { errorMessages } from '../const/errorMessages.const';
import { GetSosZmmSalesOrderResponseModel } from '../models/year-end-inventory-models/getSosZmmSalesOrderResponseModel';
import { MatSnackBar } from '@angular/material/snack-bar';
import { downloadToXLSX } from '../utils/convert-to-xlsx.utils';
import { UnrestrictedZmmModel } from '../models/year-end-inventory-models/unrestrictedZmmModel';
import { UnrestrictedTicketModel } from '../models/year-end-inventory-models/unrestrictedTicketModel';
import { ActiveListData } from '../models/year-end-inventory-models/activeListData';

const enum YearEndInventoryStates {
  INIT_STATE = 'INIT_STATE',
  COMPLETION_REPORTS_UPDATED = 'COMPLETION_REPORTS_UPDATED',
  LINE_ITEMS_UPDATED = 'LINE_ITEMS_UPDATED',
  REPORT_DATA_UPDATED = 'REPORT_DATA_UPDATED',
  SALES_ORDER_DATA_UPDATED = 'SALES_ORDER_DATA_UPDATED',
  SEARCHED_SALES_ORDER_UPDATED = 'SEARCHED_SALES_ORDER_UPDATED',
  SEARCHED_UNRESTRICTED_TICKET_UPDATED = 'SEARCHED_UNRESTRICTED_TICKET_UPDATED',
  SOS_TICKET_ADDED = 'SOS_TICKET_ADDED',
  SOS_TICKET_UPDATED = 'SOS_TICKET_UPDATED',
  STATE_RESET = 'STATE_RESET',
  UNRESTRICTED_ROW_DATA_UPDATED = 'UNRESTRICTED_ROW_DATA_UPDATED',
  UNRESTRICTED_ROW_DATA_ERROR_UPDATED = 'UNRESTRICTED_ROW_DATA_ERROR_UPDATED',
  UNRESTRICTED_TICKET_ADDED = 'UNRESTRICTED_TICKET_ADDED',
}

const initState: YearEndInventoryStoreState = {
  lineItems: [],
  reportData: [],
  saleOrderData: [],
  saleOrderDataError: false,
  searchedSalesOrder: {},
  searchedUnrestrictedTicket: {},
  sosCompletionReport: [],
  unrestrictedRowData: {},
  unrestrictedRowDataError: false,
  urCompletionReport: [],
};

@Injectable({
  providedIn: 'root',
})
export class YearEndInventoryStateService extends ObservableStore<YearEndInventoryStoreState> {
  isLoading$ = new BehaviorSubject<boolean>(false);
  isLoadingCompletionReport$ = new BehaviorSubject<boolean>(false);

  constructor(
    private _snackBar: MatSnackBar,
    private api: ApiService,
    private notificationService: NotificationService,
  ) {
    super({
      stateSliceSelector: (state: YearEndInventoryStoreState) => {
        if (!state) return initState;
        return {
          lineItems: state.lineItems,
          reportData: state.reportData,
          saleOrderData: state.saleOrderData,
          saleOrderDataError: state.saleOrderDataError,
          searchedSalesOrder: state.searchedSalesOrder,
          searchedUnrestrictedTicket: state.searchedUnrestrictedTicket,
          sosCompletionReport: state.sosCompletionReport,
          unrestrictedRowData: state.unrestrictedRowData,
          unrestrictedRowDataError: state.unrestrictedRowDataError,
          urCompletionReport: state.urCompletionReport,
        };
      },
    });
    this.setState(initState, YearEndInventoryStates.INIT_STATE);
  }

  clearAllStates() {
    const st = this.getState();
    st.lineItems = [];
    st.reportData = [];
    st.saleOrderData = [];
    st.searchedSalesOrder = {};
    st.searchedUnrestrictedTicket = {};
    st.sosCompletionReport = [];
    st.unrestrictedRowData = {};
    st.urCompletionReport = [];
    this.setState(st, YearEndInventoryStates.INIT_STATE);
  }

  // #region Reports Section ---  THIS REGION IS COLLASPIBLE
  //****************************************************
  getUploadReport(
    database: string,
    plant: number,
    fileName?: string,
    downloadFile = false,
  ) {
    this.api
      .getUploadReport(database, plant)
      .pipe(
        catchError((err) => {
          this.setError(
            errorMessages.errorMessages.reportError,
            errorMessages.errorMessages.reportErrorMsg,
            err || '',
          );
          return EMPTY;
        }),
      )
      .subscribe((report: string[]) => {
        const st = this.getState();

        if (downloadFile) {
          downloadToXLSX(report, fileName!);
        } else {
          st.reportData = report;
          this.setState(st, YearEndInventoryStates.REPORT_DATA_UPDATED);
        }
      });
  }

  getAllTicketEntriesReport(
    database: string,
    plant: number,
    fileName?: string,
    downloadFile = false,
  ) {
    this.api
      .getAllTicketEntriesReport(database, plant)
      .pipe(
        catchError((err) => {
          this.setError(
            errorMessages.errorMessages.reportError,
            errorMessages.errorMessages.reportErrorMsg,
            err || '',
          );
          return EMPTY;
        }),
      )
      .subscribe((report: string[]) => {
        const st = this.getState();

        if (downloadFile) {
          downloadToXLSX(report, fileName!);
        } else {
          st.reportData = report;
          this.setState(st, YearEndInventoryStates.REPORT_DATA_UPDATED);
        }
      });
  }

  getDifferenceReport(
    database: string,
    plant: number,
    fileName?: string,
    downloadFile = false,
  ) {
    this.api
      .getDifferenceReport(database, plant)
      .pipe(
        catchError((err) => {
          this.setError(
            errorMessages.errorMessages.reportError,
            errorMessages.errorMessages.reportErrorMsg,
            err || '',
          );
          return EMPTY;
        }),
      )
      .subscribe((report: string[]) => {
        const st = this.getState();

        if (downloadFile) {
          downloadToXLSX(report, fileName!);
        } else {
          st.reportData = report;
          this.setState(st, YearEndInventoryStates.REPORT_DATA_UPDATED);
        }
      });
  }

  getMissingTicketReport(
    database: string,
    plant: number,
    min: number,
    max: number,
    fileName?: string,
    downloadFile = false,
  ) {
    this.api
      .getMissingTIcketReport(database, plant, min, max)
      .pipe(
        catchError((err) => {
          this.setError(
            errorMessages.errorMessages.reportError,
            errorMessages.errorMessages.reportErrorMsg,
            err || '',
          );
          return EMPTY;
        }),
      )
      .subscribe((report: string[]) => {
        const st = this.getState();

        if (downloadFile) {
          downloadToXLSX(report, fileName!);
        } else {
          st.reportData = report;
          this.setState(st, YearEndInventoryStates.REPORT_DATA_UPDATED);
        }
      });
  }

  completionReports() {
    this.isLoadingCompletionReport$.next(true);
    forkJoin([
      this.api.sosCompletionReport().pipe(
        catchError((err) => {
          this.setError(
            errorMessages.errorMessages.reportError,
            errorMessages.errorMessages.reportErrorMsg,
            err || '',
          );
          return EMPTY;
        }),
      ),
      this.api.urCompletionReport().pipe(
        catchError((err) => {
          this.setError(
            errorMessages.errorMessages.reportError,
            errorMessages.errorMessages.reportErrorMsg,
            err || '',
          );
          return EMPTY;
        }),
      ),
    ]).subscribe(([sosReport, urReport]) => {
      const st = this.getState();
      st.sosCompletionReport = sosReport;
      st.urCompletionReport = urReport;
      this.setState(st, YearEndInventoryStates.COMPLETION_REPORTS_UPDATED);
      this.isLoadingCompletionReport$.next(false);
    });
  }

  // #endregion

  // #region SOS Section ---  THIS REGION IS COLLASPIBLE
  //****************************************************

  addSosTicket(sosTicket: SosTicketModel) {
    this.api
      .addSosTicket(sosTicket)
      .pipe(
        catchError((err) => {
          this.setError(
            errorMessages.errorMessages.sosTicketError,
            errorMessages.errorMessages.sosTicketErrorMsg,
            err || '',
          );
          this.setSnackbar(err.error, 'confirm', 5000);
          return EMPTY;
        }),
      )
      .subscribe((response: string) => {
        const st = this.getState();
        this.setState(st, YearEndInventoryStates.SOS_TICKET_ADDED);
        this.setSnackbar(response, 'Dismiss', 5000);
      });
  }

  getLineItems(salesOrder: number) {
    this.isLoading$.next(true);
    this.api
      .getLineItems(salesOrder)
      .pipe(
        catchError((err) => {
          this.setError(
            errorMessages.errorMessages.salesOrderDataError,
            errorMessages.errorMessages.salesOrderDataErrorMsg,
            err.error || '',
          );
          this.setSnackbar(err.error, 'confirm', 5000);
          this.isLoading$.next(false);
          return EMPTY;
        }),
      )
      .subscribe((lineItems: string[]) => {
        const st = this.getState();
        st.lineItems = lineItems;
        this.setState(st, YearEndInventoryStates.LINE_ITEMS_UPDATED);
        this.isLoading$.next(false);
      });
  }

  getSalesOrderData(salesDocument: number) {
    this.isLoading$.next(true);
    this.api
      .getSalesOrderData(salesDocument)
      .pipe(
        catchError((err) => {
          this.setError(
            errorMessages.errorMessages.salesOrderDataError,
            errorMessages.errorMessages.salesOrderDataErrorMsg,
            err.error || '',
          );
          this.setSnackbar(err.error, 'confirm', 5000);
          const st = this.getState();
          st.saleOrderData = [];
          st.saleOrderDataError = true;
          this.setState(
            st,
            YearEndInventoryStates.UNRESTRICTED_ROW_DATA_ERROR_UPDATED,
          );
          this.isLoading$.next(false);
          return EMPTY;
        }),
      )
      .subscribe((salesOrderData: GetSosZmmSalesOrderResponseModel) => {
        const st = this.getState();
        st.saleOrderData = salesOrderData.data;
        st.saleOrderDataError = false;
        this.setState(st, YearEndInventoryStates.SALES_ORDER_DATA_UPDATED);
        this.isLoading$.next(false);
      });
  }

  getSosTicket(searchCriteria: SosTicketModel) {
    this.isLoading$.next(true);
    this.api
      .getSosTicket(searchCriteria)
      .pipe(
        catchError((err) => {
          this.setError(
            errorMessages.errorMessages.searchCriteriaError,
            errorMessages.errorMessages.searchCriteriaErrorMsg,
            err.error || '',
          );
          this.setSnackbar(err.error, 'confirm', 5000);
          this.isLoading$.next(false);
          return EMPTY;
        }),
      )
      .subscribe((searchedSalesOrder: SosTicketModel) => {
        const st = this.getState();
        st.searchedSalesOrder = searchedSalesOrder;
        this.setState(st, YearEndInventoryStates.SEARCHED_SALES_ORDER_UPDATED);
        this.isLoading$.next(false);
      });
  }

  updateSosTicket(sosTicket: SosTicketModel) {
    this.api
      .updateSosTicket(sosTicket)
      .pipe(
        catchError((err) => {
          this.setError(
            errorMessages.errorMessages.sosTicketError,
            errorMessages.errorMessages.sosTicketErrorMsg,
            err || '',
          );
          this.setSnackbar(err.error, 'confirm', 5000);
          return EMPTY;
        }),
      )
      .subscribe((response: string) => {
        const st = this.getState();
        this.setState(st, YearEndInventoryStates.SOS_TICKET_UPDATED);
        this.setSnackbar(response, 'Dismiss', 5000);
      });
  }
  // #endregion

  // #region Unrestricted Section ---  THIS REGION IS COLLASPIBLE
  //*************************************************************

  addUnrestrictedTicket(unrestrictedTicket: UnrestrictedTicketModel) {
    this.api
      .addUnrestrictedTicket(unrestrictedTicket)
      .pipe(
        catchError((err) => {
          this.setError(
            errorMessages.errorMessages.addUnrestrictedTicketError,
            errorMessages.errorMessages.addUnrestrictedTicketErrorMsg,
            err || '',
          );
          this.setSnackbar(err.error, 'confirm', 5000);
          return EMPTY;
        }),
      )
      .subscribe((response: string) => {
        console.log('TICKET ADDED');
        const st = this.getState();
        this.setState(st, YearEndInventoryStates.UNRESTRICTED_TICKET_ADDED);
        this.setSnackbar(response, 'Dismiss', 5000);
      });
  }

  getUnrestrictedRowData(material: string) {
    this.isLoading$.next(true);
    this.api
      .getUnrestrictedRowData(material)
      .pipe(
        catchError((err) => {
          this.setError(
            errorMessages.errorMessages.unrestrictedRowDataError,
            errorMessages.errorMessages.unrestrictedRowDataErrorMsg,
            err.error || '',
          );
          this.setSnackbar(err.error, 'confirm', 5000);
          const st = this.getState();
          st.unrestrictedRowData = {};
          st.unrestrictedRowDataError = true;
          this.setState(
            st,
            YearEndInventoryStates.UNRESTRICTED_ROW_DATA_ERROR_UPDATED,
          );
          this.isLoading$.next(false);
          return EMPTY;
        }),
      )
      .subscribe((unrestrictedRow: ActiveListData) => {
        const st = this.getState();
        st.unrestrictedRowData = unrestrictedRow;
        st.unrestrictedRowDataError = false;
        this.setState(st, YearEndInventoryStates.UNRESTRICTED_ROW_DATA_UPDATED);
        this.isLoading$.next(false);
      });
  }

  getUnrestrictedTicket(ticketNumber: number) {
    this.isLoading$.next(true);
    this.api
      .getUnrestrictedTicket(ticketNumber)
      .pipe(
        catchError((err) => {
          this.setError(
            errorMessages.errorMessages.searchCriteriaError,
            errorMessages.errorMessages.searchCriteriaErrorMsg,
            err.error || '',
          );
          this.setSnackbar(err.error, 'confirm', 5000);
          this.isLoading$.next(false);
          return EMPTY;
        }),
      )
      .subscribe((unrestricktedTicket: UnrestrictedTicketModel) => {
        const st = this.getState();
        st.searchedUnrestrictedTicket = unrestricktedTicket!;
        this.setState(
          st,
          YearEndInventoryStates.SEARCHED_UNRESTRICTED_TICKET_UPDATED,
        );
        this.isLoading$.next(false);
      });
  }

  updateUnrestrictedTicket(unrestrictedTicket: UnrestrictedTicketModel) {
    this.api
      .updateUnrestrictedTicket(unrestrictedTicket)
      .pipe(
        catchError((err) => {
          this.setError(
            errorMessages.errorMessages.unrestrictedTicketError,
            errorMessages.errorMessages.unrestrictedTicketErrorMsg,
            err || '',
          );
          this.setSnackbar(err.error, 'confirm', 5000);
          return EMPTY;
        }),
      )
      .subscribe((response: string) => {
        const st = this.getState();
        this.setState(st, YearEndInventoryStates.SOS_TICKET_UPDATED);
        this.setSnackbar(response, 'Dismiss', 5000);
      });
  }

  // #endregion

  private setError(title: string, description: string, details: string) {
    this.notificationService.setError({ title, description, details });
  }

  private setSnackbar(message: string, confirm: string, duration?: number) {
    this._snackBar.open(message, confirm, {
      horizontalPosition: 'start',
      verticalPosition: 'bottom',
      duration: duration,
    });
  }
}
