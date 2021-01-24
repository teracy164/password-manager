import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LoadingComponent } from './loading.component';
import { Loading } from './loading.service';

@NgModule({
  declarations: [LoadingComponent],
  imports: [CommonModule],
  providers: [Loading],
  exports: [LoadingComponent],
})
export class LoadingModule {}
