import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'year-end-inventory';

  constructor(private router: Router) {}

  completionReport() {
    this.router.navigate(['/viewReports/admin/completionReport']);
  }

  locationReport() {
    this.router.navigate(['/viewReports/admin/locationReport']);
  }
}
