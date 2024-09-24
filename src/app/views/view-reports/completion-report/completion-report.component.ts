import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { locationDetails } from 'src/app/const/locations.const';
import { CompletionReportsModel } from 'src/app/models/location-reports.model';
import { SosCompletionReportModel } from 'src/app/models/year-end-inventory-models/sosCompletionReportModel';
import { URCompletionReportModel } from 'src/app/models/year-end-inventory-models/uRCompletionReportModel';
import { YearEndInventoryStoreState } from 'src/app/models/year-end-inventory-store-state.model';
import { YearEndInventoryStateService } from 'src/app/state/year-end-inventory-store.service';
import { getCompletionReportTotals } from 'src/app/utils/completion-reports.utils';
import * as Highcharts from 'highcharts';
import {
  SeriesClickEventObject,
  SeriesColumnOptions,
  XAxisOptions,
} from 'highcharts';
import { columnChartOptions } from 'src/app/const/columnChartOptions.const';

@Component({
  selector: 'app-completion-report',
  templateUrl: './completion-report.component.html',
  styleUrls: ['./completion-report.component.scss'],
})
export class CompletionReportComponent implements OnInit, OnDestroy {
  areAllLocationsSelected(): boolean {
    return this.locations.every(location => location.selected);
  }
  
  //highcharts variables
  chartOptions = JSON.parse(JSON.stringify(columnChartOptions));
  highcharts: typeof Highcharts = Highcharts;
  updateFlag = false;

  //component variables
  completionData: CompletionReportsModel[] = [];
  isLoadingCompletionReport$ =
    this.yearEndInventoryService.isLoadingCompletionReport$;
  locations: { name: string; selected: boolean }[] = [];
  selectedLocations: string[] = [];

  private sub = new Subscription();
  private sosCompletionReportData: SosCompletionReportModel[] = [];
  private urCompletionReportData: URCompletionReportModel[] = [];

  constructor(private yearEndInventoryService: YearEndInventoryStateService) {}

  ngOnInit(): void {
    this.sub.add(
      this.yearEndInventoryService.stateChanged
        .pipe()
        .subscribe((state: YearEndInventoryStoreState) => {
          this.isLoadingCompletionReport$.next(true);
          this.completionData = [];
          if (state.sosCompletionReport.length) {
            this.sosCompletionReportData = state.sosCompletionReport;
            this.urCompletionReportData = state.urCompletionReport;
            locationDetails.forEach((location) => {
              this.locations.push({
                name: location.locationName,
                selected: true,
              });
              this.selectedLocations.push(location.locationName);
              this.completionData.push(
                getCompletionReportTotals(
                  location.locationName,
                  this.sosCompletionReportData,
                  this.urCompletionReportData,
                ),
              );
            });
            this.initialChartSetup();
            this.updateFlag = true;
            this.isLoadingCompletionReport$.next(false);
          } else {
            this.yearEndInventoryService.completionReports();
          }
        }),
    );
  }

  itemSelected(): void {
    this.selectedLocations = [];
    this.selectedLocations = this.locations
      .filter((menuitem) => menuitem.selected)
      .map((menuitem) => menuitem.name);
    this.setChartCategories();
    this.setChartSeriesData();
  }

  toggleAllLocations(): void {
    const allSelected = this.locations.every(location => location.selected);
    if (allSelected) {
      // If all locations are selected, toggle them to not selected
      this.locations.forEach(location => location.selected = false);
    } else {
      // If any location is not selected, toggle all to selected
      this.locations.forEach(location => location.selected = true);
    }
    // Update the chart categories and redraw the chart
    this.itemSelected();
  }

  refreshData(): void {
    this.yearEndInventoryService.completionReports();
  }

  private initialChartSetup(): void {
    this.setChartEvents();
    this.setChartCategories();
    this.setChartSeriesData();
  }

  private redrawChart(): void {
    this.updateFlag = true;
  }

  private setChartEvents(): void {
    this.chartOptions.plotOptions.column.events = {
      click: this.getChartClick.bind(this),
    };
  }

  private getChartClick(event: SeriesClickEventObject): boolean {
    if ((<XAxisOptions>this.chartOptions.xAxis).categories.length === 1) {
      this.initialChartSetup();
      this.redrawChart();
      return false;
    }
    const clickedCategory = event.point.category.toString();
    const index = event.point.series.index;
    this.setChartCategories([clickedCategory]);
    this.setChartSeriesData(clickedCategory, index);
    this.redrawChart();
    return false;
  }

  private setChartCategories(setCategories?: string[]): void {
    const categories: string[] = setCategories
      ? setCategories
      : this.selectedLocations;
    (<XAxisOptions>this.chartOptions.xAxis).categories = categories;
    this.redrawChart();
  }

  private setChartSeriesData(clickedCategory?: string, index?: number): void {
    (<SeriesColumnOptions>this.chartOptions.series[0]).data = [];
    (<SeriesColumnOptions>this.chartOptions.series[1]).data = [];

    const clickedLocationData = this.completionData.find(
      (report) => report.locationName === clickedCategory,
    );

    const selectedLocationData = this.completionData.filter((report) =>
      this.selectedLocations.includes(report.locationName),
    );

    const percentageCompleted = [
      selectedLocationData.map((report) => report.sosPercentageCompleted),
      selectedLocationData.map((report) => report.urPercentageCompleted),
    ];

    if (clickedLocationData) {
      if (index === 0) {
        (<SeriesColumnOptions>this.chartOptions.series[0]).data.push(
          clickedLocationData.sosPercentageCompleted,
        );
      } else {
        (<SeriesColumnOptions>this.chartOptions.series[1]).data.push(
          clickedLocationData.urPercentageCompleted,
        );
      }
    } else {
      percentageCompleted.forEach((series, index) => {
        series.forEach((item) => {
          (<SeriesColumnOptions>this.chartOptions.series[index]).data.push(
            item,
          );
        });
      });
    }
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
