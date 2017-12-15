import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { FormsModule }   from '@angular/forms';

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
import { FollowmeService } from '../services/followme.service';
import { WindowRefService } from '../services/windowref.service';
import { GoogleUserService } from '../services/googleUser.service';


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
        VideoconferenceModule
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
        FollowmeService,
        GoogleUserService
        ]
})

export class DashboardModule { }
