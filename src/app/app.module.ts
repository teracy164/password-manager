import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Page1Component } from './pages/page1.component';
import { GoogleDriveApiService } from './shared/google-drive-api.service';

@NgModule({
  declarations: [AppComponent, Page1Component],
  imports: [BrowserModule, AppRoutingModule],
  providers: [GoogleDriveApiService],
  bootstrap: [AppComponent],
})
export class AppModule {}
