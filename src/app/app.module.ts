import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { PasswordModule } from './password/password.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderModule } from './shared/components/header/header.module';
import { LoadingModule } from './shared/components/loading/loading.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

const swPath = environment.production
  ? 'password-manager/ngsw-worker.js'
  : 'ngsw-worker.js';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    HeaderModule,
    PasswordModule,
    BrowserAnimationsModule,
    LoadingModule,
    ServiceWorkerModule.register(swPath, { enabled: environment.production }),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
