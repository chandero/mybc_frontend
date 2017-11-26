import { NgModule, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MdlModule } from '@angular-mdl/core';
import { AuthGuard } from '../_guards/auth.guard';
import { VideoconferenceComponent } from './videoconference.component';
import { WindowRefService } from '../services/windowref.service';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MdlModule
  ],
  declarations: [VideoconferenceComponent],
  providers: [WindowRefService, AuthGuard]
})

export class VideoconferenceModule  { }
