import { ModuleWithProviders } from '@angular/core'
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/index';
import { DashboardComponent } from './dashboard/index';
import { IdentifierComponent } from './identifier/index';
import { PasswordComponent } from './password/index';
import { WebphoneComponent } from './webphone/index';
import { CdrComponent } from './cdr/index';
import { ContactsComponent } from './contacts/index';
import { ContactComponent } from './contact/index';
import { ConferenceComponent } from './conference/index';
import { VideoconferenceComponent } from './videoconference/index';
import { ConferencesComponent } from './conferences/index';
import { VoicemailComponent } from './voicemail/index';
import { FollowmeComponent } from './followme/index';
import { SettingsComponent } from './settings/index';
import { AuthGuard } from './_guards/index';

export const appRoutes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    component: LoginComponent,
    children: [
      { path: '', redirectTo: 'identifier', pathMatch: 'full' },
      { path: 'identifier', component: IdentifierComponent },
      { path: 'password', component: PasswordComponent }
    ]
  },
    	{	
		path: 'dashboard',
		component: DashboardComponent,
    children: [
			{ path : '', redirectTo: 'webphone', pathMatch: 'full' },
	    	{ path: 'webphone', component: WebphoneComponent,     canActivate: [AuthGuard] },
        { path: 'cdr', component: CdrComponent,     canActivate: [AuthGuard] },
        { path: 'contacts', component: ContactsComponent,     canActivate: [AuthGuard] },
        { path: 'contact', component: ContactComponent,     canActivate: [AuthGuard] },
        { path: 'conference', component: ConferenceComponent,     canActivate: [AuthGuard] },
        { path: 'conferences', component: ConferencesComponent,     canActivate: [AuthGuard] },
        { path: 'videoconference', component: VideoconferenceComponent,     canActivate: [AuthGuard] },
        { path: 'voicemail', component: VoicemailComponent,     canActivate: [AuthGuard] },
        { path: 'followme' , component: FollowmeComponent,     canActivate: [AuthGuard] },
        { path: 'settings', component: SettingsComponent,     canActivate: [AuthGuard] }
    	],
    canActivate: [AuthGuard]
  	},
	{ path: '**', component: DashboardComponent }
];

export const routing_app = RouterModule.forRoot(appRoutes, { useHash: true });