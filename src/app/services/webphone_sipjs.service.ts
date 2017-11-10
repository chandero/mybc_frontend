import { EventEmitter, Injectable, Inject, ViewContainerRef, ElementRef, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AudioPlayerService } from './audioplayer.service';
import { WindowRefService } from '../services/windowref.service';
declare var SIP: any;

export class call_sip {
    public callId:string;
    public callSrc:string;
    public callDst:string;
    public callTripart:string;
    public callStatus:number;
    public callDate:string;
    public callMicOn:boolean;
    public callVideo:boolean;

    constructor(){}
}

@Injectable()
export class WebphoneSipJSService {

     @ViewChild('audio_remote') remoteAudio:ElementRef;

    public progressCall$:EventEmitter<any>;
    public failedCall$:EventEmitter<any>;
    public endedCall$:EventEmitter<any>;
    public confirmedCall$:EventEmitter<any>;
    public succeededCall$:EventEmitter<any>;
    public holdCall$:EventEmitter<any>;
    public unholdCall$:EventEmitter<any>;
    public muteCall$:EventEmitter<any>;
    public unmuteCall$:EventEmitter<any>;
    public incomingCall$:EventEmitter<any>;
    public answerCall$:EventEmitter<any>;
    public remoteStreamCall$:EventEmitter<any>;


    private _socket: any;
    private _configuration: any;
    private _sip: any;
    private _session:any; 
    private _eventHandlers:any;   
    private _options:any;

    private _domain:string;
    private _user:string;
    private _secret:string;

    private _window : Window;

    constructor(private audioPlayer: AudioPlayerService, windowRef: WindowRefService){
        this._window = windowRef.nativeWindow;
        this.progressCall$ = new EventEmitter();
        this.failedCall$ = new EventEmitter<any>();
        this.confirmedCall$ = new EventEmitter<any>();
        this.endedCall$ = new EventEmitter<any>();
        this.confirmedCall$ = new EventEmitter<any>();
        this.succeededCall$ = new EventEmitter<any>();
        this.holdCall$ = new EventEmitter<any>();
        this.unholdCall$ = new EventEmitter<any>();
        this.muteCall$ = new EventEmitter<any>();
        this.unmuteCall$ = new EventEmitter<any>();
        this.incomingCall$ = new EventEmitter<any>();
        this.answerCall$ = new EventEmitter<any>();
        this.remoteStreamCall$ = new EventEmitter<any>();

        this.startRegister();
    }

    startRegister(){
        this._domain = `${this._window.location.hostname}`;
        this._user = localStorage.getItem('mybcexten');
        this._secret = localStorage.getItem('mybcsecret');
    }    
}