import { Component } from '@angular/core';
import { Loading } from './loading.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent {
  constructor(private service: Loading) {}

  get isLoading() {
    return this.service.isLoading;
  }

  get message() {
    return this.service.message;
  }

  get options() {
    return this.service.options;
  }
}
