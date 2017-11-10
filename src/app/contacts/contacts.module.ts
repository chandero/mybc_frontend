import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MdlModule } from '@angular-mdl/core';
import { MdlSelectModule } from '@angular-mdl/select';
import { MdlPopoverModule } from '@angular-mdl/popover';

import { ContactsComponent } from './contacts.component';

import { AuthGuard } from '../_guards/auth.guard';

import { ContactService } from '../services/contact.service';
import { WindowRefService } from '../services/windowref.service';

@NgModule({
    declarations: [
        ContactsComponent
    ],
    imports: [
        CommonModule,
    	RouterModule,
        MdlModule,
        MdlSelectModule,
        MdlPopoverModule,
    ],
    exports: [
        ContactsComponent],
    providers: [WindowRefService , AuthGuard, ContactService]          
})

export class ContactsModule {}