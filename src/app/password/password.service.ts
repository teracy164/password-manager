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
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  async selectFile(file: FileMetaInfo) {
    this.passwords = await this.drive.getPasswordFile(file.id, this.key);
    this.storage.setPasswordFileInfo(file);
  }

  async createFile(fileName: string) {
    const result = await this.drive.createEmptyFile(fileName);
    if (result) {
      this.selected = result;
      this.storage.setPasswordFileInfo(result);
    }

    return result;
  }

  async addPassword(password: Password) {
    const passwords = [...(this.passwords || []), password];
    return this.updateFile(passwords);
  }

  async updatePassword(index: number, password: Password) {
    const passwords = [...this.passwords];
    passwords.splice(index, 1, password);
    return this.updateFile(passwords);
  }

  async deletePassword(index: number) {
    const passwords = [...this.passwords];
    passwords.splice(index, 1);
    return this.updateFile(passwords);
  }

  private async updateFile(passwords: Password[]) {
    const result = await this.drive.updatePasswordFile(
      this.selected.id,
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
