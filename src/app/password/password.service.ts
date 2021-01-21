import { Injectable } from '@angular/core';
import { FileMetaInfo, Password } from 'src/types/file';
import { GoogleDriveApiService } from '../shared/google-drive-api.service';
import { StorageService } from '../shared/storage.service';

@Injectable()
export class PasswordService {
  selected: FileMetaInfo;
  passwords: Password[];
  tags: string[];

  key: string = 'test';

  constructor(
    private storage: StorageService,
    private drive: GoogleDriveApiService
  ) {}

  async init() {
    try {
      const last = this.storage.getPasswordFileInfo();
      if (last) {
        this.selected = await this.drive.getFile(last.id);
        if (this.selected) {
          const passwords = await this.drive.getPasswordFile(
            this.selected.id,
            this.key
          );
          this.setPasswordInfo(passwords);
        } else {
          throw new Error('file not found.');
        }
      }
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  private setPasswordInfo(passwords: Password[]) {
    this.passwords = passwords;
    this.tags = passwords.reduce(
      (result, pw) => result.concat(pw.tags || []),
      []
    );
  }

  async selectFile(file: FileMetaInfo) {
    const passwords = await this.drive.getPasswordFile(file.id, this.key);
    this.setPasswordInfo(passwords);

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
      this.setPasswordInfo(passwords);
    }
    return result;
  }

  async removeFileInfo() {
    this.storage.removePasswordFileInfo();
    this.selected = null;
    this.passwords = null;
  }
}
