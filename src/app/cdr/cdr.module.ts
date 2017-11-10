import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { MdlModule } from '@angular-mdl/core';
import { MdlSelectModule } from '@angular-mdl/select';
import { MdlPopoverModule } from '@angular-mdl/popover';
import { MdlDatePickerModule } from '@angular-mdl/datepicker';
import { MdlDatePickerService } from '@angular-mdl/datepicker';

import { AuthGuard } from '../_guards/auth.guard';

import { CdrService } from '../services/cdr.service';

import { CdrComponent } from './cdr.component';

import { WindowRefService } from '../services/windowref.service';

@NgModule({
    declarations: [
        CdrComponent
    ],
    imports: [
        CommonModule,
    	RouterModule,
        FormsModule,
        MdlModule,
        MdlSelectModule,
        MdlPopoverModule,
        MdlDatePickerModule
    ],
    exports: [
        CdrComponent],
    providers: [WindowRefService, CdrService, AuthGuard, MdlDatePickerService]
})

export class CdrModule {}