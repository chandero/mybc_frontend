import { Component, OnInit } from '@angular/core';
import { Cdr } from '../models/cdr.model';
import { WebphoneSIPmlService, call_sipml } from '../services/webphone_sipml.service';

import { MdlDatePickerService } from '@angular-mdl/datepicker';

import { CdrService } from '../services/cdr.service';

@Component({
  selector: 'app-cdr',
  templateUrl: './cdr.component.html',
  styleUrls: ['./cdr.component.css']
})
export class CdrComponent implements OnInit {  

  private _cdrs : {};
  private _no_records = 'No hay registros';
  private _errorMessage: any;

  private _iniDate: Date;
  private _endDate : Date;

  private _fecha_inicial: string;
  private _fecha_final: string;

  private _extension: string = localStorage.getItem('mybcexten');

  private _inCall:boolean = false;
  private _notInCall:boolean = true;
  private _currentCdr:Cdr;

  // WebPhone
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
  //

  private _startDate : any;
  private _endedDate: any;

  constructor(private webphoneService: WebphoneSIPmlService,private cdrService:CdrService, private datePicker: MdlDatePickerService) { 
    webphoneService.progressCall$.subscribe(e => this.progressHandler(e));
    webphoneService.confirmedCall$.subscribe(e => this.confirmedHandler(e));
    webphoneService.endedCall$.subscribe(e => this.endedHandler(e));
    webphoneService.failedCall$.subscribe(e => this.failedHandler(e));
    webphoneService.succeededCall$.subscribe(e => this.succeededHandler(e));
    webphoneService.incomingCall$.subscribe(e => this.incomingHandler(e));
    webphoneService.answerCall$.subscribe( e => this.answerHandler(e));
  }

  ngOnInit() {


    this._iniDate = new Date();
    this._endDate = new Date();

    this.getCdrData();
  }

  getCdrData(){
    let _iniYear = this._iniDate.getFullYear();
    let _iniMonth = this._iniDate.getMonth() + 1;
    let _iniDay = this._iniDate.getDate();

    let _endYear = this._endDate.getFullYear();
    let _endMonth =  this._endDate.getMonth() + 1;
    let _endDay = this._endDate.getDate();

    this._fecha_inicial = _iniYear + '.' + _iniMonth + '.' + _iniDay+ ' 00:00:00';
    this._fecha_final = _endYear + '.' + _endMonth + '.' +  _endDay + ' 23:59:59';


    this.cdrService.getCdrData(localStorage.getItem('mybcexten'),this._fecha_inicial, this._fecha_final)
                   .subscribe(cdrs => this._cdrs = cdrs),
                   error => this._errorMessage = <any> error;
  }

  public pickADate($event: MouseEvent) {
    this.datePicker.selectDate(this._startDate, {openFrom: $event}).subscribe( (selectedDate: Date) => {
      this._startDate = selectedDate ?selectedDate : null;
    });
  }
  

  onChangeIniDate(event){
    this._iniDate = new Date(event);
    console.log('cambia fecha:'+event);
    this.getCdrData();
  }

  onChangeEniDate(event){
    this._endDate = new Date(event);
    this.getCdrData();
  }
  
  private dial(e:string, i:number){
    this._currentCdr = this._cdrs[i];
    this._currentCdr.incall = true;
    this._inCall = true;
    this._notInCall = false;
    this.webphoneService.dial(e);  
  }

  private hangup(){
    this._currentCdr.incall = false;
    this._inCall = false;
    this._notInCall = true;    
    this.webphoneService.hangup();
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
