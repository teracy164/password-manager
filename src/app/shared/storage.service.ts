import { FileMetaInfo } from 'src/types/file';
import { GeneratePasswordOptions, Settings } from 'src/types/settings';

type KEY = 'password_file' | 'settings';

export class StorageService {
  private getItem<T>(key: KEY) {
    const data = localStorage.getItem(key);
    console.log(data, data?.length);
    if (data?.length) {
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

  getSettings(): Settings {
    const data = this.getItem<Settings>('settings');
    if (data) {
      return data;
    }

    return {
      list: {
        isShowTag: true,
      },
      generatePassword: this.getDefaultGeneratePasswordOptions(),
    };
  }

  setSettings(settings: Settings) {
    this.setItem('settings', settings);
  }

  getGeneratePasswordOptions() {
    const data = this.getSettings();
    return data?.generatePassword || this.getDefaultGeneratePasswordOptions();
  }

  setGeneratePasswordOptions(options: GeneratePasswordOptions) {
    const settings = this.getSettings();
    settings.generatePassword = options;
    this.setSettings(settings);
  }

  private getDefaultGeneratePasswordOptions(): GeneratePasswordOptions {
    return {
      length: 32,
      use: {
        lowerAlpha: true,
        upperAlpha: true,
        number: true,
        symbols: {
          '!': true,
          '#': true,
          $: true,
          '%': true,
          '&': true,
          '=': true,
          '~': true,
          '/': true,
          '*': true,
          '-': true,
          '+': true,
          '(': true,
          ')': true,
          '[': true,
          ']': true,
        },
      },
    };
  }
}
