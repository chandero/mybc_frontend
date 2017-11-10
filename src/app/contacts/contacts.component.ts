import { Component, OnInit } from '@angular/core';
import { Contact } from '../models/contact.model'; 
import { Router } from '@angular/router';

import { ContactService } from '../services/contact.service';
import { WebphoneSIPmlService, call_sipml } from '../services/webphone_sipml.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {

  private _contacts = [];
  private _errorMessage: any;
  private _no_records = 'No hay registros';

  private _searchText:string;

  private _extension: string = localStorage.getItem('mybcexten');

  private _inCall:boolean = false;
  private _notInCall:boolean = true;

  private _currentContact: Contact;

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

  constructor(private webphoneService: WebphoneSIPmlService, private router: Router, private contactService: ContactService) { 
    webphoneService.progressCall$.subscribe(e => this.progressHandler(e));
    webphoneService.confirmedCall$.subscribe(e => this.confirmedHandler(e));
    webphoneService.endedCall$.subscribe(e => this.endedHandler(e));
    webphoneService.failedCall$.subscribe(e => this.failedHandler(e));
    webphoneService.succeededCall$.subscribe(e => this.succeededHandler(e));
    webphoneService.incomingCall$.subscribe(e => this.incomingHandler(e));
    webphoneService.answerCall$.subscribe( e => this.answerHandler(e));    
  }

  ngOnInit() {
    console.log('Iniciando contact list')
    this.getContactList();
  }

  getContactList(){
    console.log('Pedir servicio contact list')
    this.contactService.getContactData().subscribe(contacts => this._contacts = contacts),
           error => this._errorMessage = <any> error;
  }

  newContact(){
    this.router.navigate(['/dashboard/contact']);
  }

  private dial(e:string, i:number){
    this._currentContact = this._contacts[i];
    this._currentContact.cont_incall = true;    
    this._inCall = true;
    this._notInCall = false;
    this.webphoneService.dial(e);  
  }

  private hangup(){
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
