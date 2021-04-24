import { Component } from '@angular/core';

@Component({
  selector: 'app-terms',
  template: `<div class="panel">
    <div class="wrapper">
      <h1>利用規約</h1>
      <ul>
        <li>・当システムの利用は自己責任でお願いします</li>
        <li>・当システム利用による損害に関して当方は一切の責任を負いません</li>
        <li>・当システムは予告なしに終了する可能性があります</li>
      </ul>
    </div>
  </div>`,
  styles: [
    `
      .panel {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0 20px;
      }
    `,
  ],
})
export class TermsComponent {}
