import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { GoogleDriveApiService } from '../shared/google-drive-api.service';
import { StorageService } from '../shared/storage.service';
import { PasswordComponent } from './password.component';
import { PasswordService } from './password.service';
import { DetailDialogModule } from './detail-dialog/detail-dialog.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SelectFileDialogModule } from './select-file-dialog/select-file-dialog.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { PasswordDetailModule } from './parts/detail.module';

@NgModule({
  declarations: [PasswordComponent],
  imports: [
    CommonModule,
    PasswordDetailModule,
    DetailDialogModule,
    SelectFileDialogModule,
    FlexLayoutModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatSnackBarModule,
  ],
  providers: [PasswordService, GoogleDriveApiService, StorageService],
  exports: [PasswordComponent],
})
export class PasswordModule {}
