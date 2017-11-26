import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MdlModule } from '@angular-mdl/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ContactComponent } from './contact.component';

import { AuthGuard } from '../_guards/auth.guard';
import { WindowRefService } from '../services/windowref.service';

@NgModule({
    declarations: [
        ContactComponent
    ],
    imports: [
        CommonModule,
    	RouterModule,
        MdlModule,
        FormsModule,
        ReactiveFormsModule
    ],
    exports: [
        ContactComponent],
    providers: [WindowRefService, AuthGuard]          
})

export class ContactModule {}