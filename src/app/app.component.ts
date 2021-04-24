import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GoogleApiService } from './shared/google-api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  /**
   * 読み込み中フラグ
   * trueの間は画面表示させない
   */
  isLoading = true;
  isSignedIn = false;

  constructor(
    private router: Router,
    private googleapi: GoogleApiService,
    private cdRef: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    this.googleapi.init();

    this.googleapi.onChangeStatus.subscribe((isSignIn: boolean) => {
      this.isSignedIn = isSignIn;
      // 画面更新
      this.cdRef.detectChanges();
    });

    this.googleapi.onLoad.subscribe((result) => {
      this.isLoading = false;
      // 画面更新
      this.cdRef.detectChanges();
    });
  }
}
