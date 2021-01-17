import { FileMetaInfo } from 'src/types/file';

type KEY = 'password_file';

export class StorageService {
  private getItem<T>(key: KEY) {
    const data = localStorage.getItem(key);
    if (data) {
      return JSON.parse(data) as T;
    }
    return null;
  }

  private setItem(key: KEY, item: any) {
    localStorage.setItem(key, JSON.stringify(item));
  }

  private removeItem(key: KEY) {
    localStorage.removeItem(key);
  }

  getPasswordFileInfo(): FileMetaInfo {
    return this.getItem<FileMetaInfo>('password_file');
  }

  setPasswordFileInfo(info: FileMetaInfo) {
    this.setItem('password_file', info);
  }

  removePasswordFileInfo() {
    this.removeItem('password_file');
  }
}
