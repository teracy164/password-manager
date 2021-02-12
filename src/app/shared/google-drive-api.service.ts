import { Injectable } from '@angular/core';
import {
  FileMetaInfo,
  FileMimeType,
  Password,
  PasswordFile,
} from 'src/types/file';
import { GoogleApiService } from './google-api.service';
import * as crypto from 'crypto-js';

const KEY_FILE_CREATED_BY = '$$createdBy';
const KEY_FILE_VERSION = '$$version';
const SYSTEM_NAME = 'PW_MANAGER_SYSTEM';
const SYSTEM_VERSION = 'v1';

@Injectable()
export class GoogleDriveApiService {
  constructor(private googleapi: GoogleApiService) {}

  get drive() {
    return this.googleapi.gapi.client.drive;
  }

  get cryptoKey() {
    return this.googleapi.userId;
  }

  public isFolder(file: FileMetaInfo) {
    return file.mimeType === 'application/vnd.google-apps.folder';
  }

  async getFiles(): Promise<FileMetaInfo[]> {
    const result = await this.drive.files.list({
      pageSize: 100,
      trashed: false,
      q: "mimeType='application/vnd.google-apps.document' and trashed = false",
      spaces: 'drive',
      fields: 'nextPageToken, files(id, kind, name, mimeType)',
    });
    if (result.status === 200) {
      return result.result.files.sort((s1: FileMetaInfo, s2: FileMetaInfo) => {
        // 種別ごとにソート
        return s1.mimeType < s2.mimeType ? 1 : -1;
      });
    } else {
      throw new Error('get files failed.');
    }
  }

  async getFile(fileId: string): Promise<FileMetaInfo> {
    const result = await this.drive.files.get({ fileId });
    if (result.status === 200) {
      return result.result;
    } else {
      throw new Error('get file failed.');
    }
  }

  async getFileContents(options: {
    fileId: string;
    mimeType?: string;
  }): Promise<string> {
    if (!options.mimeType) {
      options.mimeType = 'text/plain';
    }
    const result = await this.drive.files.export(options);
    if (result.status === 200) {
      return result.body;
    } else {
      throw new Error('get file contents failed.');
    }
  }

  async getPasswordFile(fileId: string) {
    const contents = await this.getFileContents({
      fileId,
      mimeType: 'text/plain',
    });
    return this.decode(contents, this.cryptoKey);
  }

  async createEmptyFile(fileName: string): Promise<FileMetaInfo> {
    const mimeType: FileMimeType = 'application/vnd.google-apps.document';
    const result = await this.drive.files.create({
      uploadType: 'media',
      name: fileName,
      mimeType,
    });
    if (result.status === 200) {
      return result.result;
    } else {
      throw new Error('create file failed.');
    }
  }

  async updatePasswordFile(
    fileId: string,
    passwords: Password[]
  ): Promise<FileMetaInfo> {
    const src: PasswordFile = {
      [KEY_FILE_CREATED_BY]: SYSTEM_NAME,
      [KEY_FILE_VERSION]: SYSTEM_VERSION,
      passwords,
    };

    const data = this.encryption(src, this.cryptoKey);

    const result = await this.googleapi.gapi.client.request({
      path: '/upload/drive/v3/files/' + fileId,
      method: 'PATCH',
      params: {
        uploadType: 'media',
      },
      body: data,
    });

    if (result.status === 200) {
      return result.result;
    } else {
      throw new Error('update file failed.');
    }
  }

  private decode(fileContents: string, decryptionKey: string): Password[] {
    if (!fileContents?.trim().length) {
      return [];
    }

    // 復号化
    const decryptionData = this.decryption(fileContents, decryptionKey);
    if (!decryptionData) {
      throw new Error('decryption failed.');
    }

    // 当システムのファイルであればパスワード一覧を返却
    if (decryptionData[KEY_FILE_CREATED_BY] === SYSTEM_NAME) {
      return decryptionData.passwords;
    } else {
      throw new Error('invalid file format.');
    }
  }

  private decryption(
    encryptionData: string,
    decryptionKey: string
  ): PasswordFile {
    const bytes = crypto.AES.decrypt(encryptionData.trim(), decryptionKey);
    const decryptionString = bytes.toString(crypto.enc.Utf8);
    return JSON.parse(decryptionString) as PasswordFile;
  }

  private encryption(src: PasswordFile, encryptionKey: string) {
    const json = JSON.stringify(src);
    return crypto.AES.encrypt(json, encryptionKey).toString();
  }
}
