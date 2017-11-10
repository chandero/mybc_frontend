import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { MdlModule } from '@angular-mdl/core';
import { MdlSelectModule } from '@angular-mdl/select';
import { MdlPopoverModule } from '@angular-mdl/popover';

//import { routing_login } from './login.routes';
import { LoginComponent } from './login.component';
import { IdentifierComponent } from '../identifier/index';
import { PasswordComponent } from '../password/index';

/* Guard */
import { AuthGuard } from '../_guards/auth.guard';

/* Servicios */
import { LoginService } from '../services/login.service';
import { WindowRefService } from '../services/windowref.service';

@NgModule({
    declarations: [
        LoginComponent, 
        IdentifierComponent, 
        PasswordComponent],
    imports: [
        CommonModule,
    	RouterModule,
        FormsModule,
        MdlModule,
        MdlSelectModule,
        MdlPopoverModule, 
        //routing_login,
    ],
    exports: [
        LoginComponent, 
        IdentifierComponent, 
        PasswordComponent],
    providers: [LoginService, AuthGuard, WindowRefService]
})

export class LoginModule { }