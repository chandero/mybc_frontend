import { Component, OnInit, Attribute } from '@angular/core';
import { Router } from '@angular/router';
import { MdlDialogService, MdlSnackbarService, IOpenCloseRect, MdlDialogComponent } from '@angular-mdl/core';
import { WebphoneSIPmlService } from '../services/webphone_sipml.service';
import { GoogleApiService } from 'ng-gapi';
import { GoogleUserService } from '../services/googleUser.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  private _userFullname: string = localStorage.getItem("mybcname");
  private _userPhone: string = localStorage.getItem("mybcexten");

  private _transferDialog: MdlDialogComponent;  

  private _extensionStatusImageUrl: string;
  private _data;
  private _format;
  private _timer = true;
  private _intervalSet = false;
  private _statusphone: string;

  private auth2: any;

  constructor( @Attribute("data") data, private router: Router, private webphoneService: WebphoneSIPmlService, private gapiService: GoogleApiService, private googleUserService: GoogleUserService) {
    webphoneService.progressCall$.subscribe(e => this.progressHandler(e));
    webphoneService.confirmedCall$.subscribe(e => this.confirmedHandler(e));
    webphoneService.endedCall$.subscribe(e => this.endedHandler(e));
    webphoneService.failedCall$.subscribe(e => this.failedHandler(e));
    webphoneService.succeededCall$.subscribe(e => this.succeededHandler(e));
    webphoneService.incomingCall$.subscribe(e => this.incomingHandler(e));
    webphoneService.answerCall$.subscribe(e => this.answerHandler(e));
    webphoneService.remoteStreamCall$.subscribe(e => this.remoteStreamHandler(e));
    webphoneService.registryExten$.subscribe(e => this.registryExtenHandler(e));
    webphoneService.tryregistryExten$.subscribe(e => this.tryregistryExtenHandler(e));
    webphoneService.unregistryExten$.subscribe(e => this.unregistryExtenHandler(e));
    this._extensionStatusImageUrl = "";
    this.createClock(data);

  }

  ngOnInit() {
    this.gapiService.onLoad().subscribe(()=> {
      console.log("contacts component line 60 --> gapi loaded");
      this.googleUserService.signIn();
    }); 
  }

  private logout() {
    localStorage.removeItem('mybcuser');
    this.router.navigate(['/login/identifier']);
  }

  private progressHandler(e: any) {

  }

  private confirmedHandler(e: any) {

  }

  private endedHandler(e: any) {
    this._statusphone = 'Disponible';
  }

  private failedHandler(e: any) {
    this._statusphone = 'Disponible';
  }

  private succeededHandler(e) {
    this._statusphone = '';
  }

  private incomingHandler(e) {
    this._statusphone = 'Timbrando';
  }

  private answerHandler(e) {
    this._statusphone = 'En Llamanda';
  }

  private registryExtenHandler(e) {
    this._extensionStatusImageUrl = "/mybc/assets/images/extavaliable.svg";
  }

  private tryregistryExtenHandler(e) {
    this._extensionStatusImageUrl = "/mybc/assets/images/extuna.svg";
  }

  private unregistryExtenHandler(e) {
    this._extensionStatusImageUrl = "/mybc/assets/images/extuna.svg";
  }

  private remoteStreamHandler(e) {

  }

  createClock(data) {
    var date, miliseconds;
    this._format = 'hh:mm:ss';
    this._data = data || new Date();
    if (this._timer) {
      if (this._data instanceof Date) {
        date = this._data;
      } else {
        date = new Date();
      }

      miliseconds = (60 - date.getSeconds()) * 1000;
      window.setTimeout(() => { this.refreshTime(); }, miliseconds);
    }
  }

  refreshTime() {
    this._data = new Date();
    if (!this._intervalSet) {
      window.setInterval(() => { this.refreshTime() }, 60000);
      this._intervalSet = true;
    }
  }

}
