import {
  CompletionReportsModel,
  LocationReportsEnum,
  LocationReportsModel,
} from '../models/location-reports.model';
import { SosCompletionReportModel } from '../models/year-end-inventory-models/sosCompletionReportModel';
import { URCompletionReportModel } from '../models/year-end-inventory-models/uRCompletionReportModel';

const getCompletionReportsString = (
  locationName: string,
  sosReport: SosCompletionReportModel[],
  urReport: URCompletionReportModel[],
): string => {
    
  const sosFilteredReport = sosReport.filter((item) => item.plant === (LocationReportsEnum as { [key: string]: any })[locationName],);
  const urFilteredReport = urReport.filter((item) => item.plant === (LocationReportsEnum as { [key: string]: any })[locationName],);

  //sos counts
  const sosCurrentCount = sosFilteredReport.reduce((acc, current) => acc + current.counted!, 0,);
  const sosSystemCount = sosFilteredReport.reduce((acc, current) => acc + current.sapCount!, 0,);

  //ur counts
  const urCurrentCount = urFilteredReport.reduce((acc, current) => acc + current.counted!, 0,);
  const urSystemCount = urFilteredReport.reduce((acc, current) => acc + current.sapCount!, 0,);

  const sosCompletionReportTotals: LocationReportsModel = {
    locationName: locationName,
    currentCount: sosCurrentCount,
    systemCount: sosSystemCount,
    percentageCompleted: sosCurrentCount/sosSystemCount,
  };

  const urCompletionReportTotals: LocationReportsModel = {
    locationName: locationName,
    currentCount: urCurrentCount,
    systemCount: urSystemCount,
    percentageCompleted: urCurrentCount/urSystemCount,
  };

  const popupContent = `
      <div>
        <p>${sosCompletionReportTotals.locationName} SOS completed count:</p>
        <p>${Math.round(sosCompletionReportTotals.currentCount!)} out of ${Math.round(sosCompletionReportTotals.systemCount!)} pcs</p>
        <p>${Math.round(sosCompletionReportTotals.percentageCompleted!*100)}%</p>
        <div style="display: flex; align-items: center;">
          <div style="background-color: #003a7d; flex: ${sosCompletionReportTotals.percentageCompleted!}; height: 10px; margin-right: 5px;"></div>
          <div style="background-color: white; flex: ${1 - sosCompletionReportTotals.percentageCompleted!}; height: 10px; margin-right: 5px;"></div>         
        </div>
      </div>
      <div>
        <p>${urCompletionReportTotals.locationName} Unrestricted completed count:</p>
        <p>${Math.round(urCompletionReportTotals.currentCount!)} out of ${Math.round(urCompletionReportTotals.systemCount!)} pcs</p>
        <p>${Math.round(urCompletionReportTotals.percentageCompleted!*100)}%</p>
        <div style="display: flex; align-items: center;">
          <div style="background-color: #003a7d; flex: ${urCompletionReportTotals.percentageCompleted!}; height: 10px; margin-right: 5px;"></div>
          <div style="background-color: white; flex: ${1 - urCompletionReportTotals.percentageCompleted!}; height: 10px; margin-right: 5px;"></div>         
        </div>
      </div>
    `;

  return popupContent;
};

const getCompletionReportTotals = (
  locationName: string,
  sosReport: SosCompletionReportModel[],
  urReport: URCompletionReportModel[],
): CompletionReportsModel => {
    
  const sosFilteredReport = sosReport.filter((item) => item.plant === (LocationReportsEnum as { [key: string]: any })[locationName],);
  const urFilteredReport = urReport.filter((item) => item.plant === (LocationReportsEnum as { [key: string]: any })[locationName],);

  //sos counts
  const sosCurrentCount = sosFilteredReport.reduce((acc, current) => acc + current.counted!, 0,);
  const sosSystemCount = sosFilteredReport.reduce((acc, current) => acc + current.sapCount!, 0,);

  //ur counts
  const urCurrentCount = urFilteredReport.reduce((acc, current) => acc + current.counted!, 0,);
  const urSystemCount = urFilteredReport.reduce((acc, current) => acc + current.sapCount!, 0,);

  const completionReportTotals: CompletionReportsModel = {
    locationName: locationName,
    sosCurrentCount: sosCurrentCount,
    sosSystemCount: sosSystemCount,
    sosPercentageCompleted: (sosCurrentCount/sosSystemCount)*100,
    urCurrentCount: urCurrentCount,
    urSystemCount: urSystemCount,
    urPercentageCompleted: (urCurrentCount/urSystemCount)*100,
  };

  return completionReportTotals;
};

export { getCompletionReportsString, getCompletionReportTotals };
