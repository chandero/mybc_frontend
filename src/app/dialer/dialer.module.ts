import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MdlModule } from '@angular-mdl/core';
import { MdlSelectModule } from '@angular-mdl/select';
import { MdlPopoverModule } from '@angular-mdl/popover';

import { DialerComponent } from './dialer.component';

import { AuthGuard } from '../_guards/auth.guard';

@NgModule({
    declarations: [
        DialerComponent
    ],
    imports: [
        CommonModule,
    	RouterModule,
        MdlModule,
        MdlSelectModule,
        MdlPopoverModule
    ],
    exports: [
        DialerComponent],
    providers: [{provide: Window, useValue: window}, AuthGuard]           
})

export class DialerModule {}