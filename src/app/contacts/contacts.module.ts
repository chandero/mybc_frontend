import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule }   from '@angular/forms';

import { MdlModule } from '@angular-mdl/core';

import { NG_GAPI_CONFIG, NgGapiClientConfig, GoogleApiModule } from 'ng-gapi';
import { PeopleResource } from '../services/people.resouce';
import { HttpService } from '../common/http/HttpService';
import { HttpErrorHandler } from '../common/http/HttpErrorHandler';
import { SecurityService } from '../common/security/SecurityService';


import { ContactsComponent } from './contacts.component';
import { ContactFilterPipe } from '../filters/contact.pipe';

import { AuthGuard } from '../_guards/auth.guard';

import { GoogleUserService } from '../services/googleUser.service';
import { ContactService } from '../services/contact.service';
import { WindowRefService } from '../services/windowref.service';

let gapiClientConfig: NgGapiClientConfig = {
    client_id: "783669865413-v8no6fp43ljeebqdd69km4gnnivq1otk.apps.googleusercontent.com",
    discoveryDocs: ["https://people.googleapis.com/$discovery/rest?version=v1"],
    scope: [
        "https://www.googleapis.com/auth/contacts.readonly",
        "https://www.googleapis.com/auth/contacts"
    ].join(" ")
};

@NgModule({
    declarations: [
        ContactsComponent,
        ContactFilterPipe
    ],
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        MdlModule,
        GoogleApiModule.forRoot({
            provide: NG_GAPI_CONFIG,
            useValue: gapiClientConfig
          }),
    ],
    exports: [
        ContactsComponent],
    providers: [WindowRefService , AuthGuard, ContactService, HttpService, HttpErrorHandler, SecurityService, GoogleUserService, PeopleResource]          
})

export class ContactsModule {}