import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service'; 

import { User } from '../models/user.model';

@Component({
  selector: 'login-identifier',
  templateUrl: './identifier.component.html',
  styleUrls: ['./identifier.component.css']
})

export class IdentifierComponent implements OnInit {

  private _identity:string;
  private _usererror_label: string = 'Usuario Inválido';
  private _uservalid: boolean = true;
  private _errormsg: string ="Error al contactar con el servidor";
  private _err = false;

  constructor(private router: Router, private _loginService: LoginService) { }

  ngOnInit() {
  }

  validateMsg(){
    if (this._identity.length < 1) { 
      this._err = false; 
      this._uservalid = true;
    }
  }

  validateUser(){
    this._err = false;
    this._uservalid = true;
    this._loginService.getUserdata(this._identity).subscribe(user => this.redirectToPassword(user), err => { this._err = true; });
  }

  redirectToPassword(_user: User){
    console.log('User:'+_user);
    if (_user.exte_estado){
      localStorage.setItem('mybcuser', this._identity);
      localStorage.setItem('mybcexten', _user.exte_numero);
      this.router.navigate(['/login/password']);
    } else {
      this._uservalid = false;
    }
    
  }

}
