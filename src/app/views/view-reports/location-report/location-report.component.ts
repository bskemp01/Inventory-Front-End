import { Component, OnDestroy, OnInit } from '@angular/core';
import * as Leaflet from 'leaflet';
import 'leaflet.markercluster';
import { Subscription } from 'rxjs';
import { locationDetails } from 'src/app/const/locations.const';
import { SosCompletionReportModel } from 'src/app/models/year-end-inventory-models/sosCompletionReportModel';
import { URCompletionReportModel } from 'src/app/models/year-end-inventory-models/uRCompletionReportModel';
import { YearEndInventoryStoreState } from 'src/app/models/year-end-inventory-store-state.model';
import { YearEndInventoryStateService } from 'src/app/state/year-end-inventory-store.service';
import { getCompletionReportsString } from 'src/app/utils/completion-reports.utils';

@Component({
  selector: 'app-location-report',
  templateUrl: './location-report.component.html',
  styleUrls: ['./location-report.component.scss'],
})
export class LocationReportComponent implements OnInit, OnDestroy {
  isLoadingCompletionReport$ =
    this.yearEndInventoryService.isLoadingCompletionReport$;

  map!: Leaflet.Map;
  options: Leaflet.MapOptions = {
    zoom: 5,
    center: new Leaflet.LatLng(39.673, -80.486),
  };
  showReport = 0;

  private sub = new Subscription();
  private sosCompletionReportData: SosCompletionReportModel[] = [];
  private urCompletionReportData: URCompletionReportModel[] = [];

  constructor(private yearEndInventoryService: YearEndInventoryStateService) {}

  ngOnInit(): void {
    this.sub.add(
      this.yearEndInventoryService.stateChanged
        .pipe()
        .subscribe((state: YearEndInventoryStoreState) => {
          if (state.sosCompletionReport.length) {
            this.sosCompletionReportData = state.sosCompletionReport;
            this.urCompletionReportData = state.urCompletionReport;
            if (this.map) {
              this.map.remove();
            }
            this.map = Leaflet.map('map', {
              layers: this.getLayers(
                this.sosCompletionReportData,
                this.urCompletionReportData,
              ),
              ...this.options,
            });
          } else {
            this.yearEndInventoryService.completionReports();
          }
        }),
    );
  }

  getLayers(
    sosReport: SosCompletionReportModel[],
    urReport: URCompletionReportModel[],
  ): Leaflet.Layer[] {
    this.isLoadingCompletionReport$.next(true);
    
    const markerClusterGroup = Leaflet.markerClusterGroup();
    const markers = this.getMarkers(sosReport, urReport);
    markerClusterGroup.addLayers(markers);
    

    this.isLoadingCompletionReport$.next(false);

    return [
      new Leaflet.TileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          attribution:
            '<a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors',
        } as Leaflet.TileLayerOptions,
      ),
      markerClusterGroup,
    ] as Leaflet.Layer[];
  }

  getMarkers(
    sosReport: SosCompletionReportModel[],
    urReport: URCompletionReportModel[],
  ): Leaflet.Layer[] {
    const locationsMarkers: Leaflet.Layer[] = [];
    locationDetails.forEach((location) => {
      const popupContent = getCompletionReportsString(
        location.locationName,
        sosReport,
        urReport,
      );
      const marker = this.setMarkerDetails(
        location.locationName,
        location.lat,
        location.lon,
        popupContent,
      );
      locationsMarkers.push(marker);
    });
    return locationsMarkers;
  }

  setMarkerDetails(
    markerName: string,
    lat: number,
    lon: number,
    popupContent: string,
  ): Leaflet.Marker {
    const marker = new Leaflet.Marker(new Leaflet.LatLng(lat, lon), {
      icon: new Leaflet.Icon({
        iconSize: [35, 35],
        iconAnchor: [13, 35],
        iconUrl: 'assets/hormann-marker.svg',
      }),
      title: markerName,
    } as Leaflet.MarkerOptions);

    marker.bindPopup(popupContent);
    marker.on('mouseover', () => {
      marker.openPopup();
    });
    marker.on('mouseout', () => {
      marker.closePopup();
    });

    return marker;
  }

  refreshData() {
    this.yearEndInventoryService.completionReports();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
