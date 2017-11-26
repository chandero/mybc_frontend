import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MdlModule } from '@angular-mdl/core';
import { DialerComponent } from './dialer.component';

import { AuthGuard } from '../_guards/auth.guard';

@NgModule({
    declarations: [
        DialerComponent
    ],
    imports: [
        CommonModule,
    	RouterModule,
        MdlModule
    ],
    exports: [
        DialerComponent],
    providers: [{provide: Window, useValue: window}, AuthGuard]           
})

export class DialerModule {}