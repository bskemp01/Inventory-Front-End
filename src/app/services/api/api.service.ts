import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActiveListData } from 'src/app/models/year-end-inventory-models/activeListData';
import { GetSosZmmSalesOrderResponseModel } from 'src/app/models/year-end-inventory-models/getSosZmmSalesOrderResponseModel';
import { SosCompletionReportModel } from 'src/app/models/year-end-inventory-models/sosCompletionReportModel';
import { SosTicketModel } from 'src/app/models/year-end-inventory-models/sosTicketModel';
import { URCompletionReportModel } from 'src/app/models/year-end-inventory-models/uRCompletionReportModel';
import { UnrestrictedTicketModel } from 'src/app/models/year-end-inventory-models/unrestrictedTicketModel';
import { UnrestrictedZmmModel } from 'src/app/models/year-end-inventory-models/unrestrictedZmmModel';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private _baseYearEndInventoryURL = 'http://usspxdb002';

  constructor(private http: HttpClient) {}

  //Reports
  getUploadReport(database: string, plant: number) {
    return this.http.get<string[]>(
      `${this._baseYearEndInventoryURL}/api/Reports/UploadReport/${database}/${plant}`,
    );
  }

  getAllTicketEntriesReport(database: string, plant: number) {
    return this.http.get<string[]>(
      `${this._baseYearEndInventoryURL}/api/Reports/AllTicketEntriesReport/${database}/${plant}`,
    );
  }

  getDifferenceReport(database: string, plant: number) {
    return this.http.get<string[]>(
      `${this._baseYearEndInventoryURL}/api/Reports/DifferenceReport/${database}/${plant}`,
    );
  }

  getMissingTIcketReport(
    database: string,
    plant: number,
    min: number,
    max: number,
  ) {
    return this.http.get<string[]>(
      `${this._baseYearEndInventoryURL}/api/Reports/MissingTicketReport/${database}/${plant}/min=${min}max=${max}`,
    );
  }

  sosCompletionReport() {
    return this.http.get<SosCompletionReportModel[]>(
      `${this._baseYearEndInventoryURL}/api/Reports/SosCompletionReport`,
    );
  }

  urCompletionReport() {
    return this.http.get<URCompletionReportModel[]>(
      `${this._baseYearEndInventoryURL}/api/Reports/URCompletionReport`,
    );
  }

  //SOS Section
  addSosTicket(sosTicket: SosTicketModel) {
    return this.http.post(
      `${this._baseYearEndInventoryURL}/api/SosTickets/addSOSTicket`,
      sosTicket,
      { responseType: 'text' },
    );
  }

  getLineItems(salesOrder: number) {
    return this.http.get<string[]>(
      `${this._baseYearEndInventoryURL}/api/SosTickets/getLineItemsBySalesOrder/${salesOrder}`,
    );
  }

  getSosTicket(searchCriteria: SosTicketModel) {
    const params = new HttpParams({
      fromObject: {
        ticketNumber: searchCriteria.ticketNumber?.toString() || '',
        salesOrder: searchCriteria.salesOrder?.toString() || '',
        lineItem: searchCriteria.lineItem?.toString() || '',
      },
    });

    return this.http.get<SosTicketModel>(
      `${this._baseYearEndInventoryURL}/api/SosTickets/getSOSTicket`,
      { params },
    );
  }

  getSalesOrderData(salesDocument: number) {
    return this.http.get<GetSosZmmSalesOrderResponseModel>(
      `${this._baseYearEndInventoryURL}/api/SosZmmTable/getZMMTable/${salesDocument}`,
    );
  }

  updateSosTicket(sosTicket: SosTicketModel) {
    return this.http.put(
      `${this._baseYearEndInventoryURL}/api/SosTickets/updateSOSTicket`,
      sosTicket,
      { responseType: 'text' },
    );
  }

  //Unrestricted Section
  addUnrestrictedTicket(UnrestrictedTicket: UnrestrictedTicketModel) {
    return this.http.post(
      `${this._baseYearEndInventoryURL}/api/UnrestrictedTickets/addUnrestrictedTicket`,
      UnrestrictedTicket,
      { responseType: 'text' },
    );
  }

  getUnrestrictedTicket(ticketNumber: number) {
    return this.http.get<UnrestrictedTicketModel>(
      `${this._baseYearEndInventoryURL}/api/UnrestrictedTickets/getUnrestrictedTicket/${ticketNumber}`,
    );
  }

  getUnrestrictedRowData(material: string) {
    return this.http.get<ActiveListData>(
      `${this._baseYearEndInventoryURL}/api/UnrestrictedZmmTable/getZMMTableRow/${material}`,
    );
  }

  updateUnrestrictedTicket(unrestrictedTicket: UnrestrictedTicketModel) {
    return this.http.put(
      `${this._baseYearEndInventoryURL}/api/UnrestrictedTickets/updateUnrestrictedTicket`,
      unrestrictedTicket,
      { responseType: 'text' },
    );
  }
}
