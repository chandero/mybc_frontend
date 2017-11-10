import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';


import { AppComponent } from './app.component';
import { routing_app } from './app.routing';
import { AuthGuard } from './_guards/index';

import { WindowRefService } from './services/windowref.service';
import { WebphoneSIPmlService } from './services/webphone_sipml.service';
import { GoogleService } from './services/google.service';
import { LoginModule } from './login/login.module';
import { DashboardModule } from './dashboard/dashboard.module';



@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    DashboardModule,
    LoginModule,
    routing_app
  ],
  providers: [AuthGuard, WindowRefService, WebphoneSIPmlService, GoogleService ],
  bootstrap: [AppComponent]
})

export class AppModule { }

