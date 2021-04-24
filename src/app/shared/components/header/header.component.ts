import { Component, Input, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { GoogleApiService } from '../../google-api.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @Input() isSignedIn = false;

  constructor(
    private googleapi: GoogleApiService,
    private router: Router,
    private ngZone: NgZone
  ) {
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
      this.navigate('passwords');
    }
  }

  async onClickSignOut() {
    await this.googleapi.signOut();
    this.navigate('/');
  }

  private navigate(path: string) {
    this.ngZone.run(() => {
      this.router.navigate([path]);
    });
  }
}
