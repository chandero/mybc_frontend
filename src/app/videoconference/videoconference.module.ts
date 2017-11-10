import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';


import { MdlModule } from '@angular-mdl/core';
import { MdlSelectModule } from '@angular-mdl/select';
import { MdlPopoverModule } from '@angular-mdl/popover';

import { AuthGuard } from '../_guards/auth.guard';

import { VideoconferenceComponent } from './videoconference.component';

import { WindowRefService } from '../services/windowref.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MdlModule,
    MdlSelectModule,
    MdlPopoverModule,    
  ],
  declarations: [VideoconferenceComponent],
  providers: [WindowRefService, AuthGuard]
})
export class VideoconferenceModule { }
