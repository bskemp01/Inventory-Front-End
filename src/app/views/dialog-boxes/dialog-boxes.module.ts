import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchSosTicketDialogComponent } from './search-sos-ticket-dialog/search-sos-ticket-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ReportsSelectionComponent } from './reports-selection/reports-selection.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { SearchUnrestrictedTicketDialogComponent } from './search-unrestricted-ticket-dialog/search-unrestricted-ticket-dialog.component';
import { LoadingModule } from '../loading/loading.module';

@NgModule({
  declarations: [SearchSosTicketDialogComponent, ReportsSelectionComponent, SearchUnrestrictedTicketDialogComponent],
  imports: [
    CommonModule,
    FormsModule,
    LoadingModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatDividerModule,
    MatFormFieldModule,
    MatDialogModule,
    MatSelectModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
})
export class DialogBoxesModule {}
