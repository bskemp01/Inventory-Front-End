export interface LocationReportsModel {
  locationName?: string;
  currentCount?: number;
  systemCount?: number;
  percentageCompleted?: number;
}

export interface CompletionReportsModel {
    locationName?: string;
    sosCurrentCount?: number;
    sosSystemCount?: number;
    sosPercentageCompleted?: number;
    urCurrentCount?: number;
    urSystemCount?: number;
    urPercentageCompleted?: number;
}

export enum LocationReportsEnum {
  'Montgomery' = 2810,
  'Sparta' = 2811,
  'Allentown' = 2820,
  'Cincinnati' = 2830,
  'Minneapolis' = 2835,
  'GrandRapids' = 2845,
  'Aurora' = 2855,
  'Commack' = 2865,
  'Nashville' = 2875,
  'Greensboro' = 2885,
}
