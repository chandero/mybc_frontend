import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MdlModule } from '@angular-mdl/core';
import { MdlSelectModule } from '@angular-mdl/select';
import { MdlPopoverModule } from '@angular-mdl/popover';

import { MenuComponent } from './menu.component';

@NgModule({
    declarations: [
        MenuComponent 
    ],
    imports: [
        CommonModule,
    	RouterModule,
        MdlModule,
        MdlSelectModule,
        MdlPopoverModule,        
    ],
    exports: [
        MenuComponent]
})

export class MenuModule { }