import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InventoryAppsComponent } from './inventory-apps/inventory-apps.component';
import { LoadingModule } from '../loading/loading.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { NgIf } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SalesOrderSpecificComponent } from './sales-order-specific/sales-order-specific.component';
import { UnrestrictedComponent } from './unrestricted/unrestricted.component';

const routes: Routes = [
  {
    path: '',
    component: InventoryAppsComponent,
  },
];

@NgModule({
  declarations: [
    InventoryAppsComponent,
    SalesOrderSpecificComponent,
    UnrestrictedComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    LoadingModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatTabsModule,
    NgIf,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
  ],
})
export class InventoryAppsModule {}
