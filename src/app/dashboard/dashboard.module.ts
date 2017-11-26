import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { FormsModule }   from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { GoogleReducers } from '../store/reducer';
import { GapiLoader } from '../services/gapi-loader.service';
import { UserProfileActions } from '../store/user-profile/user-profile.actions';

import { MdlModule } from '@angular-mdl/core';
import { MyDateRangePickerModule } from 'mydaterangepicker';

import { MenuModule } from '../menu/index';
import { StatusModule } from '../status/index';
import { CdrModule } from '../cdr/index';
import { ContactsModule } from '../contacts/index';
import { ContactModule } from '../contact/index';
import { ConferencesModule } from '../conferences/index';
import { ConferenceModule } from '../conference/index';
import { VideoconferenceModule } from '../videoconference/index';

import { DashboardComponent } from './dashboard.component';
import { HeaderComponent } from '../header/header.component';
import { WizardComponent } from '../wizard/wizard.component';
import { WebphoneComponent } from '../webphone/webphone.component';
import { FollowmeComponent } from '../followme/followme.component';
import { VoicemailComponent } from '../voicemail/voicemail.component';
import { SettingsComponent } from '../settings/settings.component';

import { ClockComponent } from '../clock/clock.component';


import { AuthGuard } from '../_guards/index';
import { WebphoneSIPmlService} from '../services/webphone_sipml.service';
import { AudioPlayerService } from '../services/audioplayer.service';
import { VideoconferenceService } from '../services/videoconference.service';
import { VoicemailService } from '../services/voicemail.service';
import { WindowRefService } from '../services/windowref.service';

import { GoogleService } from '../services/gapi-authorization.service';

@NgModule({
    declarations: [
        DashboardComponent,
        HeaderComponent,
        WizardComponent,
        WebphoneComponent,
        FollowmeComponent,
        VoicemailComponent,
        SettingsComponent,
        ClockComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        MdlModule,
        MyDateRangePickerModule,

        MenuModule,
        StatusModule,
        CdrModule,
        ContactsModule,
        ContactModule,
        ConferencesModule,
        ConferenceModule,
        VideoconferenceModule,
        StoreModule.provideStore(GoogleReducers)
    ],
    exports: [
        DashboardComponent,
        HeaderComponent,
        WizardComponent,
        WebphoneComponent,
        FollowmeComponent,
        VoicemailComponent,
        SettingsComponent,
        ClockComponent],
    providers: [
        WindowRefService, 
        AuthGuard, 
        WebphoneSIPmlService, 
        AudioPlayerService, 
        VideoconferenceService, 
        VoicemailService, 
        GoogleService,
        GapiLoader,
        UserProfileActions
        ]
})

export class DashboardModule { }
