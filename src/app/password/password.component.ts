import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { LoginService } from '../services/login.service';

import { User } from '../models/user.model';

@Component({
  selector: 'login-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css']
})

export class PasswordComponent implements OnInit {

  private _userpassword: string;
  private _uservalid: boolean = true;
  private _err: boolean = false;
  private _userlabel_error: string = 'Combinación usuario y contraseña invalida!';
  private _errormsg: string ="Error al contactar con el servidor";

  private _username = localStorage.getItem('mybcuser');

  constructor(private _loginService: LoginService, private router: Router) { }

  ngOnInit() {
  }

  validatePassword(){
    this._err = false;
    this._uservalid = true;
    if (this._userpassword === undefined){
      this._userpassword = 'none';
    }
    this._loginService.validateSignIn(this._username, this._userpassword).subscribe(user => this.redirectToHome(user), err => this.validateError(err));
  }

  validateError(err: any){
    this._uservalid = false;
    console.log("Error status"+ err);
  }

  redirectToHome(user: User){
    if (user.exte_estado){
        localStorage.setItem('mybcsecret', user.exte_clave);
        localStorage.setItem("mybcname", user.exte_descripcion);
        this.router.navigate(['/dashboard']);
    } else {
      this._uservalid = false;
    }
  }

}
