import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ReportsSelectionComponent } from '../dialog-boxes/reports-selection/reports-selection.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent {
  constructor(
    private dialog: MatDialog,
    private router: Router,
  ) {}

  openReportsSelection() {
    this.dialog.open(ReportsSelectionComponent, {
      disableClose: true,
      id: 'ReportsSelectionDialog',
      width: '625px',
    });
  }

  openCompletionReport() {
    this.router.navigate(['/viewReports/admin/completionReport']);
  }

  inventoryApps() {
    this.router.navigate(['/inventoryApps']);
  }

  openLocationMap() {
    this.router.navigate(['/viewReports/admin/locationReport']);
  }

  viewReports() {
    this.router.navigate(['/viewReports']);
  }
}
