import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule }   from '@angular/forms';

import { MdlModule } from '@angular-mdl/core';
import { MdlSelectModule } from '@angular-mdl/select';
import { MdlPopoverModule } from '@angular-mdl/popover';

import { ContactsComponent } from './contacts.component';
import { ContactFilterPipe } from '../filters/contact.pipe';

import { AuthGuard } from '../_guards/auth.guard';

import { ContactService } from '../services/contact.service';
import { WindowRefService } from '../services/windowref.service';

@NgModule({
    declarations: [
        ContactsComponent,
        ContactFilterPipe
    ],
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        MdlModule,
        MdlSelectModule,
        MdlPopoverModule,
    ],
    exports: [
        ContactsComponent],
    providers: [WindowRefService , AuthGuard, ContactService]          
})

export class ContactsModule {}