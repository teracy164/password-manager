import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { GoogleDriveApiService } from '../shared/google-drive-api.service';
import { StorageService } from '../shared/storage.service';
import { SelectFileComponent } from './select-file.component';

@NgModule({
  declarations: [SelectFileComponent],
  imports: [CommonModule],
  providers: [GoogleDriveApiService, StorageService],
  exports: [SelectFileComponent],
})
export class SelectFileModule {}
