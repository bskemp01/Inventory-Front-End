import { ActiveListData } from './year-end-inventory-models/activeListData';
import { SosCompletionReportModel } from './year-end-inventory-models/sosCompletionReportModel';
import { SosTicketModel } from './year-end-inventory-models/sosTicketModel';
import { SosZmmModel } from './year-end-inventory-models/sosZmmModel';
import { URCompletionReportModel } from './year-end-inventory-models/uRCompletionReportModel';
import { UnrestrictedTicketModel } from './year-end-inventory-models/unrestrictedTicketModel';
import { UnrestrictedZmmModel } from './year-end-inventory-models/unrestrictedZmmModel';

export interface YearEndInventoryStoreState {
  lineItems: string[];
  reportData: string[];
  saleOrderData: SosZmmModel[];
  saleOrderDataError: boolean;
  searchedSalesOrder: SosTicketModel;
  searchedUnrestrictedTicket: UnrestrictedTicketModel;
  sosCompletionReport: SosCompletionReportModel[];
  unrestrictedRowData: ActiveListData;
  unrestrictedRowDataError: boolean;
  urCompletionReport: URCompletionReportModel[];
}
