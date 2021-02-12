import { EventEmitter, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class GoogleApiService {
  readonly DISCOVERY_DOCS = [
    'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
  ];
  readonly SCOPES = 'https://www.googleapis.com/auth/drive';

  /** Google API JS読み込み完了時 */
  readonly onLoad = new EventEmitter<boolean>();
  /** 認証状態変更検知用 */
  readonly onChangeStatus = new EventEmitter<boolean>();

  get gapi() {
    return (window as any).gapi;
  }
  get instAuth2() {
    return this.gapi.auth2.getAuthInstance();
  }

  get currentUser() {
    return this.instAuth2.currentUser;
  }

  get userId() {
    return this.currentUser.get().getBasicProfile().getId();
  }

  public init() {
    this.loadGoogleApiScript();
  }

  /**
   * sign in
   *
   * 完了はonChangeStatusをsubscribeすること
   */
  public signIn() {
    this.instAuth2.signIn();
  }

  /**
   * sign out
   *
   * 完了はonChangeStatusをsubscribeすること
   */
  public signOut() {
    this.instAuth2.signOut();
  }

  /**
   * GoogleAPIのJSファイル読み込み
   * ※これやらないとグローバル変数のgapiが参照できない
   */
  private loadGoogleApiScript() {
    const elScript = document.createElement('script');
    elScript.async = true;
    elScript.defer = true;
    elScript.src = 'https://apis.google.com/js/api.js';

    // jsファイル読み込み完了時（フラグを落とすことで画面表示を開始する）
    elScript.onload = this.handleClientLoad();

    document.head.appendChild(elScript);
  }

  private handleClientLoad() {
    const self = this;
    return (event) => self.gapi.load('client:auth2', self.handleInitClient());
  }

  private handleInitClient() {
    const self = this;
    return () =>
      self.gapi.client
        .init({
          apiKey: environment.googleApi.apiKey,
          clientId: environment.googleApi.clientId,
          discoveryDocs: self.DISCOVERY_DOCS,
          scope: self.SCOPES,
        })
        .then(
          () => {
            // JS読み込み完了を通知
            self.onLoad.emit(true);

            const isSignedIn = self.instAuth2.isSignedIn;
            // Listen for sign-in state changes.
            isSignedIn.listen((isSignIn: boolean) => {
              self.onChangeStatus.emit(isSignIn);
            });

            // 最初のSignIn状態を通知
            self.onChangeStatus.next(isSignedIn.get());
          },
          (error) => {
            console.error(error);
            // on error
            self.onLoad.emit(false);
          }
        );
  }
}
