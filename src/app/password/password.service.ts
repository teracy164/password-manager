import { Injectable } from '@angular/core';
import { FileMetaInfo, Password } from 'src/types/file';
import { GoogleDriveApiService } from '../shared/google-drive-api.service';
import { StorageService } from '../shared/storage.service';
import { v4 as uuidV4 } from 'uuid';

@Injectable()
export class PasswordService {
  selected: FileMetaInfo;
  passwords: Password[];
  /** タグ単位のパスワード */
  passwordsEachTag: { [tag: string]: Password[] };
  tags: string[];

  key: string = 'test';
  readonly noTagKey = 'NoTag';

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
    this.passwords = passwords.sort((s1, s2) => (s1.name < s2.name ? -1 : 1));
    this.passwordsEachTag = this.toPasswordsEachTag(this.passwords);
    this.tags = this.toTags(this.passwords);
  }

  private toPasswordsEachTag(
    passwords: Password[]
  ): { [tag: string]: Password[] } {
    return passwords.reduce(
      (passwords, pw) => {
        if (pw.tags.length) {
          pw.tags.forEach((tag) => {
            if (!passwords[tag]) passwords[tag] = [];
            passwords[tag].push(pw);
          });
        } else {
          passwords[this.noTagKey].push(pw);
        }
        return passwords;
      },
      { [this.noTagKey]: [] }
    );
  }

  private toTags(passwords: Password[]) {
    return Array.from(
      new Set(passwords.reduce((tags, pw) => tags.concat(pw.tags), []))
    ).sort((s1, s2) => (s1 < s2 ? -1 : 1));
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
    password.id = uuidV4();

    const passwords = [...(this.passwords || []), password];
    return this.updateFile(passwords);
  }

  async updatePassword(passwordId: string, password: Password) {
    const index = this.passwords.findIndex((pw) => pw.id === passwordId);
    if (index >= 0) {
      const passwords = [...this.passwords];
      passwords.splice(index, 1, password);
      return this.updateFile(passwords);
    }
    return false;
  }

  async deletePassword(passwordId: string) {
    const index = this.passwords.findIndex((pw) => pw.id === passwordId);
    if (index >= 0) {
      const passwords = [...this.passwords];
      passwords.splice(index, 1);
      return this.updateFile(passwords);
    }
    return false;
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

  private createPassword() {
    const lowerAlpha = 'abcdefghijklmnopqrstuvwxyz';
    const upperAlpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const number = '0123456789';
    const symbol = '!#$%&=~/*-+';
  }
}