import { Component, ViewChild } from '@angular/core';
import { YearEndInventoryStateService } from 'src/app/state/year-end-inventory-store.service';
import { SalesOrderSpecificComponent } from '../sales-order-specific/sales-order-specific.component';
import { UnrestrictedComponent } from '../unrestricted/unrestricted.component';

@Component({
  selector: 'app-inventory-apps',
  templateUrl: './inventory-apps.component.html',
  styleUrls: ['./inventory-apps.component.scss'],
})
export class InventoryAppsComponent {
  @ViewChild(SalesOrderSpecificComponent) private salesOrderSpecificComponent!: SalesOrderSpecificComponent;
  @ViewChild(UnrestrictedComponent) private unrestrictedComponent!: UnrestrictedComponent;

  isLoading$ = this.yearEndInventoryService.isLoading$;

  constructor(
    private yearEndInventoryService: YearEndInventoryStateService,
  ) {}

  onTabChanged(event: any) {
    if (event.index === 0) {
      this.salesOrderSpecificComponent.clearForm();
    } else {
      this.unrestrictedComponent.clearForm();
    }
  }
}
