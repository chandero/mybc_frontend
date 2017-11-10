import { Component } from '@angular/core';
import { WebphoneSIPmlService, call_sipml } from '../services/webphone_sipml.service';
import { ClockComponent } from '../clock/clock.component';

@Component({
    selector: 'dashboard-header',
    templateUrl: 'header.component.html',
    styleUrls: ['header.component.css']
})
export class HeaderComponent {

  private _startclock: boolean = false;

  private _ready: boolean = true;
  private _idle: boolean = false;
  private _ringing: boolean = false;
  private _incall: boolean = false;
  private _inprogress: boolean = false;
  private _isHold: boolean = false;
  private _isMuted: boolean = false;
  private _isRemoteVideo:boolean = false;

  private _callEvent:any;  

  private _statusText: string = "Disponible";

  private _dialnumber: string = "";
  private _identifier: string = "Desconocido";  

  constructor(private webphoneService: WebphoneSIPmlService){
    webphoneService.progressCall$.subscribe(e => this.progressHandler(e));
    webphoneService.confirmedCall$.subscribe(e => this.confirmedHandler(e));
    webphoneService.endedCall$.subscribe(e => this.endedHandler(e));
    webphoneService.failedCall$.subscribe(e => this.failedHandler(e));
    webphoneService.succeededCall$.subscribe(e => this.succeededHandler(e));
    webphoneService.incomingCall$.subscribe(e => this.incomingHandler(e));
    webphoneService.answerCall$.subscribe( e => this.answerHandler(e));
  }

  private answer() {
    this.webphoneService.answer(this._callEvent);
  }

  private reject() {
    this.webphoneService.reject(this._callEvent);
    this._dialnumber = "";
  }

  private hangup() {
    this.webphoneService.hangup();
    this._dialnumber = "";
  }


  // Event Handler
  
  public progressHandler(e: any) {
    console.log('webphone: Progress event ');
    this._statusText = 'Llamando';
    this._identifier = e;
    this._idle = false;
    this._ready = false;
    this._ringing = false;
    this._incall = false;
    this._inprogress = true;

    this._startclock = true;
  }

  public answerHandler(e:any){
    console.log('Answer:');
    this._statusText = 'En Llamada';
    this._idle = false;
    this._ready = false;
    this._ringing = false;
    this._incall = true;
    this._inprogress = false;
    this._startclock = true;    

  }

  public confirmedHandler(e: any) {
    console.log('confirmed');
    this._statusText = 'En Llamada Confirmed';
    this._idle = false;
    this._ready = false;
    this._ringing = false;
    this._incall = true;
    this._inprogress = true;
  }

  public endedHandler(e: any) {
    console.log('Evento: ended:');
    this._statusText = 'Disponible';
    this._identifier = '';
    this._idle = true;
    this._ready = true;
    this._incall = false;
    this._ringing = false;
    this._inprogress = false;

    this._startclock = false;

  }

  public failedHandler(e: any) {
    console.log('failed');
    this._statusText = 'Disponible';
    this._identifier = '';
    this._idle = true;
    this._ready = true;
    this._incall = false;
    this._ringing = false;
    this._inprogress = false;

    this._startclock = false;
    
  }

  public succeededHandler(e: any) {
    console.log('succeeded');
  }

  public holdHandler(e: any) {
    this._isHold = true;
  }

  public unholdHandler(e: any) {
    this._isHold = false;
  }

  public muteHandler(e: any) {
    this._isMuted = true;
  }

  public unmuteHandler(e: any) {
    this._isMuted = false;
  }

  public incomingHandler(e: any){
    this._statusText = 'Timbrando';
    this._identifier = e;
    this._idle = false;
    this._ready = false;
    this._incall = false;
    this._ringing = true;
    this._inprogress = false;

    this._startclock = false;
    this._callEvent = e;    
  }

  private onTransferDialogShow(e:any){

  }

  private onTransferDialogHide(){

  }
  


}
