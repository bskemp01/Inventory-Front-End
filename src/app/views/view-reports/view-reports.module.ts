import { AgChartsAngular } from 'ag-charts-angular';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import { CommonModule } from '@angular/common';
import { CompletionReportComponent } from './completion-report/completion-report.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HighchartsChartModule } from 'highcharts-angular';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LoadingModule } from '../loading/loading.module';
import { LocationReportComponent } from './location-report/location-report.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewReportsComponent } from './view-reports/view-reports.component';
import { MatTableModule } from '@angular/material/table';

const routes: Routes = [
  {
    path: '',
    component: ViewReportsComponent,
  },
  {
    path: 'admin/completionReport',
    component: CompletionReportComponent,
  },
  {
    path: 'admin/locationReport',
    component: LocationReportComponent,
  },
];

@NgModule({
  declarations: [
    ViewReportsComponent,
    CompletionReportComponent,
    LocationReportComponent,
  ],
  imports: [
    CommonModule,
    AgGridModule,
    AgGridAngular,
    AgChartsAngular,
    FormsModule,
    HighchartsChartModule,
    LeafletModule,
    LoadingModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatSelectModule,
    MatTableModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
  ],
})
export class ViewReportsModule {}
