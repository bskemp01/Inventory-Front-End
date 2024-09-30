import { FormControl } from '@angular/forms';

export interface SalesOrderSpecificModel {
  plantLocation?: FormControl<string | null | undefined>;
  storageLocation?: FormControl<string | null | undefined>;
  areaLocation?: FormControl<string | null | undefined>;
  ticketNumber?: FormControl<string | null | undefined>;
  salesOrder?: FormControl<number | null | undefined>;
  lineItem?: FormControl<number | null | undefined>;
  material?: FormControl<string | null | undefined>;
  description?: FormControl<string | null | undefined>;
  quantity?: FormControl<number | null | undefined>;
  userEntered?: FormControl<string | null | undefined>;
}

export interface UnrestrictedModel {
  plantLocation?: FormControl<string | null | undefined>;
  storageLocation?: FormControl<string | null | undefined>;
  areaLocation?: FormControl<string | null | undefined>;
  ticketNumber?: FormControl<string | null | undefined>;
  partNumber?: FormControl<string | null | undefined>;
  description?: FormControl<string | null | undefined>;
  unitOfMeasure?: FormControl<string | null | undefined>;
  quantity?: FormControl<number | null | undefined>;
  userEntered?: FormControl<string | null | undefined>;
}

export interface ReportsForm {
  reportType?: FormControl<string | null | undefined>;
  report?: FormControl<string | null | undefined>;
  plant?: FormControl<string | null | undefined>;
  min?: FormControl<number | null | undefined>;
  max?: FormControl<number | null | undefined>;
  fileName?: FormControl<string | null | undefined>;
}
