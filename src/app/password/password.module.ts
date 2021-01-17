import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { GoogleDriveApiService } from '../shared/google-drive-api.service';
import { StorageService } from '../shared/storage.service';
import { PasswordComponent } from './password.component';
import { PasswordService } from './password.service';

@NgModule({
  declarations: [PasswordComponent],
  imports: [CommonModule],
  providers: [PasswordService, GoogleDriveApiService, StorageService],
  exports: [PasswordComponent],
})
export class PasswordModule {}
