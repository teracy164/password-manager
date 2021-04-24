import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GoogleApiService } from '../shared/google-api.service';

@Component({
  selector: 'app-terms',
  templateUrl: './top.component.html',
  styleUrls: ['./top.component.scss'],
})
export class TopComponent implements OnInit {
  constructor(
    private router: Router,
    private google: GoogleApiService,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    if (this.google.isSignedIn) {
      this.navigate('passwords');
    }
  }

  onClickTerms() {
    this.navigate('terms');
  }

  private navigate(path: string) {
    this.ngZone.run(() => {
      this.router.navigate([path]);
    });
  }
}
