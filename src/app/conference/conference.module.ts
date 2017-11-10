import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


import { MdlModule } from '@angular-mdl/core';
import { MdlSelectModule } from '@angular-mdl/select';
import { MdlPopoverModule } from '@angular-mdl/popover';

import { ConferenceComponent } from './conference.component';

import { AuthGuard } from '../_guards/auth.guard';

import { WindowRefService } from '../services/windowref.service';

@NgModule({
    declarations: [
        ConferenceComponent
    ],
    imports: [
        CommonModule,
    	RouterModule,
        MdlModule,
        MdlSelectModule,
        MdlPopoverModule
    ],
    exports: [
        ConferenceComponent],
    providers: [WindowRefService , AuthGuard]        
})

export class ConferenceModule {}