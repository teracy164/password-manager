import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FileMetaInfo } from 'src/types/file';
import { GoogleDriveApiService } from '../shared/google-drive-api.service';
import { StorageService } from '../shared/storage.service';

@Component({
  selector: 'app-select-file',
  templateUrl: './select-file.component.html',
})
export class SelectFileComponent implements OnInit {
  files: FileMetaInfo[];
  selected: {
    fileId: string;
    contents: string;
  };
  constructor(
    private driveApi: GoogleDriveApiService,
    private storage: StorageService,
    private cdRef: ChangeDetectorRef
  ) {}

  isFolder(file: FileMetaInfo) {
    return this.driveApi.isFolder(file);
  }

  async ngOnInit() {
    this.files = await this.driveApi.getFiles();
    this.cdRef.detectChanges();
  }

  async onClickFile(file: FileMetaInfo) {
    const contents = await this.driveApi.getFileContents({ fileId: file.id });
    if (contents) {
      this.selected = { fileId: file.id, contents };

      this.storage.setPasswordFileInfo(file);

      this.cdRef.detectChanges();
    }
  }
}
