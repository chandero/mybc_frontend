import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


import { MdlModule } from '@angular-mdl/core';

import { ConferencesComponent } from './conferences.component';

import { AuthGuard } from '../_guards/auth.guard';

import { WindowRefService } from '../services/windowref.service';

@NgModule({
    declarations: [
        ConferencesComponent
    ],
    imports: [
        CommonModule,
    	RouterModule,
        MdlModule
    ],
    exports: [
        ConferencesComponent],
    providers: [WindowRefService , AuthGuard]          
})

export class ConferencesModule {}