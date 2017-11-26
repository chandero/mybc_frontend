import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { MdlModule } from '@angular-mdl/core';

import { MyDateRangePickerModule } from 'mydaterangepicker';

import { CdrFilterPipe } from '../filters/cdr.pipe';

import { AuthGuard } from '../_guards/auth.guard';

import { CdrService } from '../services/cdr.service';

import { CdrComponent } from './cdr.component';

import { WindowRefService } from '../services/windowref.service';

@NgModule({
    declarations: [
        CdrComponent,
        CdrFilterPipe
    ],
    imports: [
        CommonModule,
    	  RouterModule,
        FormsModule,
        MdlModule,
        MyDateRangePickerModule
    ],
    exports: [
        CdrComponent],
    providers: [WindowRefService, CdrService, AuthGuard]
})

export class CdrModule {}
