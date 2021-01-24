import { Injectable, NgZone } from '@angular/core';

interface LoadingOptions {
  isOverlay?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class Loading {
  private _message = '';
  private _isLoading = false;
  private _options: LoadingOptions = {
    isOverlay: false,
  };

  get isLoading() {
    return this._isLoading;
  }

  get message() {
    return this._message;
  }

  get options() {
    return this._options;
  }

  constructor(private ngZone: NgZone) {}

  start(
    message: string = 'loading...',
    options: LoadingOptions = { isOverlay: true }
  ) {
    this.ngZone.run(() => {
      this._message = message;
      if (options) {
        Object.assign(this._options, options);
      }
      this._isLoading = true;
    });
  }

  updateMessage(message: string) {
    this.ngZone.run(() => {
      this._message = message;
    });
  }

  end() {
    this.ngZone.run(() => {
      this._isLoading = false;
    });
  }
}
