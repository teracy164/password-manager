import { Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-terms',
  templateUrl: './top.component.html',
  styleUrls: ['./top.component.scss'],
})
export class TopComponent {
  constructor(private router: Router, private ngZone: NgZone) {}

  onClickTerms() {
    this.ngZone.run(() => {
      this.router.navigate(['terms']);
    });
  }
}
