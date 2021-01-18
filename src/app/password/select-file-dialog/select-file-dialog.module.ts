import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SelectFileDialogComponent } from './select-file-dialog.component';
import { GoogleDriveApiService } from 'src/app/shared/google-drive-api.service';
import { StorageService } from 'src/app/shared/storage.service';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [SelectFileDialogComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  providers: [GoogleDriveApiService, StorageService],
  exports: [SelectFileDialogComponent],
})
export class SelectFileDialogModule {}
