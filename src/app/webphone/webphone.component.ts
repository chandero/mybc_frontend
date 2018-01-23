import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { WebphoneSIPmlService, call_sipml } from '../services/webphone_sipml.service';
import { ClockComponent } from '../clock/clock.component';
import { MdlDialogService, MdlSnackbarService, IOpenCloseRect, MdlDialogComponent } from '@angular-mdl/core';
import { Observable } from 'rxjs/Observable';

declare var Clipboard: any;

@Component({
  selector: 'app-webphone',
  templateUrl: './webphone.component.html',
  styleUrls: ['./webphone.component.css'],
  entryComponents: [ClockComponent]
})


export class WebphoneComponent implements OnInit, AfterViewInit {

  private _startclock: boolean = false;

  private _ready: boolean = true;
  private _idle: boolean = false;
  private _ringing: boolean = false;
  private _incall: boolean = false;
  private _inprogress: boolean = false;
  private _isHold: boolean = false;
  private _isMuted: boolean = false;
  private _isRemoteVideo: boolean = false;

  private _callEvent: any;

  private _remoteVideoVisible: boolean = false;

  private _transferDialog: MdlDialogComponent;

  private _statusText: string = "Disponible";

  private _dialnumber: string = "";
  private _identifier: string = "DESCONOCIDO";
  private _key: string;
  private _zeroDown : boolean;
  private _zeroUp : boolean;
  private _downTimer: any;

  @ViewChild('remoteVideo') _remoteVideo: HTMLMediaElement;
  @ViewChild('_remoteVideo') _remoteVideoDialog: MdlDialogComponent;
  @ViewChild('numberToDial', { read: ElementRef }) _numberToDial: ElementRef;

  private _clipboard:any;  

  constructor(private webphoneService: WebphoneSIPmlService, private dialogService: MdlDialogService, private snackbarService: MdlSnackbarService) {
    webphoneService.progressCall$.subscribe(e => this.progressHandler(e));
    webphoneService.confirmedCall$.subscribe(e => this.confirmedHandler(e));
    webphoneService.endedCall$.subscribe(e => this.endedHandler(e));
    webphoneService.failedCall$.subscribe(e => this.failedHandler(e));
    webphoneService.succeededCall$.subscribe(e => this.succeededHandler(e));
    webphoneService.incomingCall$.subscribe(e => this.incomingHandler(e));
    webphoneService.answerCall$.subscribe(e => this.answerHandler(e));

  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this._numberToDial.nativeElement.focus();
    this._clipboard = new Clipboard('.mdl-icon');
  }

  clipboardPaste() {
    
  }

  @HostListener('document:keydown', ['$event'])
  handleKeydownEvent(event: KeyboardEvent) {
    this._key = event.key;
    switch(this._key){
      case '0': this.zeroHold();
        break;
      default:
        break;
    }
  }

  @HostListener('document:keyup', ['$event'])
  handleKeyupEvent(event: KeyboardEvent) {
    console.log("event keyup:"+event);
    event.stopPropagation();
    this._key = event.key;
    switch (this._key) {
      case '0': this.zeroCancel();//this.numberClick(0);
        break;
      case '1': this.numberClick(1);
        break;
      case '2': this.numberClick(2);
        break;
      case '3': this.numberClick(3);
        break;
      case '4': this.numberClick(4);
        break;
      case '5': this.numberClick(5);
        break;
      case '6': this.numberClick(6);
        break;
      case '7': this.numberClick(7);
        break;
      case '8': this.numberClick(8);
        break;
      case '9': this.numberClick(9);
        break;
      case '#': this.numberClick('#');
        break;
      case '*': this.numberClick('*');
        break;
      case '+': this.numberClick('+');
        break;
      case 'Enter': this.dial();
        break;
      case 'Backspace' : this._dialnumber = this._dialnumber.slice(0, -1);
        break;
      default:
        console.log("No se cuál es:( "+ this._key +" ).");
        break;
    }
  }

  private validateDialnumber() {
    if (this._dialnumber.length > 0) {
      this._idle = true;
    } else {
      this._idle = false;
    }
  }

  private zeroHold(){
    this._zeroDown = false;
    this._zeroUp = false;
    this._downTimer = setTimeout( () => this.zeroAction(), 800);
  }


  private zeroCancel(){
    if (this._zeroDown)
    {
      clearTimeout(this._downTimer);
      this._downTimer = null;
      this._zeroDown = false;
    } else {
      this.numberClick('0');
      this._zeroUp = true;
    }
  }

  private zeroAction() {
    if (!this._zeroUp) {
      clearTimeout(this._downTimer);
      this._downTimer = null;
      this._zeroDown = true;
      this.numberClick('+');
    }
  }

  private numberClick(number) {
    this._dialnumber += number;
    this.validateDialnumber();
    this.sendDtmf(number);
  }

  private dialerChange(event) {
    event.stopPropagation;
    this._dialnumber = event.target.value;
    this.validateDialnumber();
  }

  private clear() {
    this._dialnumber = "";
    this._idle = false;
  }

  // webphone methods

  private dial() {
    this.webphoneService.dial(this._dialnumber);
    this._dialnumber = "";
  }

  private sendDtmf(e: string) {
    this.webphoneService.sendDtmfTone(e);
  }

  private answer() {
    this.webphoneService.answer(this._callEvent);
  }

  private reject() {
    this.webphoneService.reject(this._callEvent);
    this._dialnumber = "";
    this.validateDialnumber();
  }

  private hangup() {
    this.webphoneService.hangup();
    this._dialnumber = "";
    this.validateDialnumber();
  }

  private togglemute() {
    console.log('Evento: webphone send togglemute');
    this.webphoneService.togglemute();
  }

  private togglehold() {
    this.webphoneService.togglehold();
  }

  private transfer() {
    this.webphoneService.transfer(this._dialnumber);
  }

  private togglevideo() {
    this.webphoneService.togglevideo();
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

  public answerHandler(e: any) {
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

    if (this._isRemoteVideo) {
      this._remoteVideoDialog.close();
      this._isRemoteVideo = false;
    }
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

    if (this._isRemoteVideo) {
      this._remoteVideoDialog.close();
      this._isRemoteVideo = false;
    }

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

  public incomingHandler(e: any) {
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

  private onTransferDialogShow(e: any) {

  }

  private onTransferDialogHide() {

  }

}
