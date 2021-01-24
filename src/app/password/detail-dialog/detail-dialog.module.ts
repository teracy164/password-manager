import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { DetailDialogComponent } from './detail-dialog.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { GeneratePasswordDialogModule } from '../generate-password-dialog/generate-password-dialog.module';

@NgModule({
  declarations: [DetailDialogComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GeneratePasswordDialogModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatChipsModule,
    MatAutocompleteModule,
  ],
  exports: [DetailDialogComponent],
})
export class DetailDialogModule {}
