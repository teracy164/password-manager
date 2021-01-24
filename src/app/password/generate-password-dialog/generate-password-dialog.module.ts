import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { GeneratePasswordDialogComponent } from './generate-password-dialog.component';

@NgModule({
  declarations: [GeneratePasswordDialogComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatCheckboxModule,
    MatInputModule,
  ],
  exports: [GeneratePasswordDialogComponent],
})
export class GeneratePasswordDialogModule {}
