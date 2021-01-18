import { Component, Input } from '@angular/core';
import { GoogleApiService } from '../../google-api.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  @Input() isSignedIn = false;

  constructor(private googleapi: GoogleApiService) {
    this.googleapi.onChangeStatus.subscribe((isSignIn: boolean) => {
      this.isSignedIn = isSignIn;
    });
  }

  onClickSignIn() {
    this.googleapi.signIn();
  }
  onClickSignOut() {
    this.googleapi.signOut();
  }
}
