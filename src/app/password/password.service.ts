import { Injectable } from '@angular/core';
import { FileMetaInfo, Password } from 'src/types/file';
import { GoogleDriveApiService } from '../shared/google-drive-api.service';
import { StorageService } from '../shared/storage.service';

@Injectable()
export class PasswordService {
  selected: FileMetaInfo;
  passwords: Password[];

  key: string = 'test';

  constructor(
    private storage: StorageService,
    private drive: GoogleDriveApiService
  ) {}

  async init() {
    try {
      this.selected = this.storage.getPasswordFileInfo();
      if (this.selected) {
        this.passwords = await this.drive.getPasswordFile(
          this.selected.id,
          this.key
        );
      }
      console.log(this.passwords);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  async createFile(fileName: string) {
    const result = await this.drive.createEmptyFile(fileName);
    if (result) {
      this.storage.setPasswordFileInfo(result);
    }

    return result;
  }

  async updateFile(fileId: string, password: Password) {
    const passwords = [...(this.passwords || []), password];
    console.log(passwords);
    const result = await this.drive.updatePasswordFile(
      fileId,
      passwords,
      this.key
    );
    if (result) {
      this.passwords = passwords;
    }
    return result;
  }

  async removeFileInfo() {
    this.storage.removePasswordFileInfo();
    this.selected = null;
    this.passwords = null;
  }
}
