import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TermsComponent } from './terms.component';

@NgModule({
  declarations: [TermsComponent],
  imports: [RouterModule],
  exports: [TermsComponent],
})
export class TermsModule {}
