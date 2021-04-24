import { Component, EventEmitter, NgZone, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { GoogleApiService } from '../../google-api.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  isSignedIn = false;

  constructor(
    private googleapi: GoogleApiService,
    private router: Router,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    this.isSignedIn = this.googleapi.isSignedIn;
    this.googleapi.onChangeStatus.subscribe((isSignIn: boolean) => {
      this.isSignedIn = isSignIn;
    });
  }

  onClickLogo() {
    if (this.isSignedIn) {
      this.navigate('/passwords');
    } else {
      this.navigate('/');
    }
  }

  async onClickSignIn() {
    const result = await this.googleapi.signIn();
    if (result) {
      location.href = '/password-manager/passwords';
    }
  }

  async onClickSignOut() {
    await this.googleapi.signOut();
    location.href = '/password-manager';
  }

  private navigate(path: string) {
    this.ngZone.run(() => {
      this.router.navigate([path]);
    });
  }
}
