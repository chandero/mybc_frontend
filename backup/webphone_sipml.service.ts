import { EventEmitter, Injectable, ViewContainerRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AudioPlayerService } from './audioplayer.service';
import { WindowRefService } from '../services/windowref.service';

declare var SIPml:any;

export class call_sipml {
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
export class WebphoneSIPmlService {
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

    // sipml vars
    private _sipStack:any;
    private _eventListener:any;
    private _sipuri:string;
    private _callerid:string;
    private _registerSession:any;
    private _callListener:any;
    
    private _socket: any;
    private _configuration: any;
    private _session:any; 
    private _eventHandlers:any;   
    private _options:any;

    private _domain:string;
    private _user:string;
    private _secret:string;

    private _remoteAudio: any;
    private _localAudio: any;

    private _window: Window;    

    constructor(windowRef: WindowRefService, private audioPlayer: AudioPlayerService){

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

        this._domain = `${this._window.location.hostname}`;
        this._user = localStorage.getItem('mybcexten');
        this._secret = localStorage.getItem('mybcsecret');

        this.startRegister();
    }

    private startRegister(){
        var readyCallback = e => {
            this.createSipStack();
        }
        var errorCallback = e => {
            console.error('Fállo al inicializar SIPml:  ' + e.message);
        }
        SIPml.init( readyCallback, errorCallback );
    }

    private createSipStack(){

        this._eventListener = e => {

            switch (e.type) {
                    case 'failed_to_start': case 'failed_to_stop': case 'stopping': case 'stopped': {

                        console.log("Failed to connect to SIP SERVER")
                        this._session = null;
                        this._sipStack = null;
                        this._registerSession = null;
                        this.emitUnRegisterEvent('No se pudo realizar el registro');
                        break;
                    }
                    case 'started': {
                        console.log("Trying to Login");
                        this.login(); // function to login in sip server
                        this.emitTryToConnect('Registrando...');
                        break;
                    }   
                    case 'connected': {
                        this.emitConnectedEvent('Registrado con Sip Server');
                        break;
                    }   
                    case 'sent_request': {

                        this.emitRequestMsg(e.description);
                        break;
                   }   
                   case 'terminated': {
                        this.emitRequestMsg(e.description);
                        break;
                   }
                   case 'i_new_call': {
                        if (this._session) {
                            // Do not accept the incoming call if we're Already 'in call'
                            e.newSession.hangup(); // Comment this line for multi-line support
                        } else {

                            this._session = e.newSession;
                            // Display web page in the WHO is calling
                            var sRemoteNumber = (this._session.getRemoteFriendlyName() || 'Desconocido');
                            this.emitIncomingcallEvent(sRemoteNumber);
                        }
                        break;
                   } 
                   case 'm_permission_requested': {
                        break;
                   }
                   case 'm_permission_accepted':
                   case 'm_permission_refused': {
                        if (e.type == 'm_permission_refused') {
                            this._session = null;
                            this.emitRefusedEvent(e.description);
                        }
                        break;
                    } 
                    case 'i_new_message': {
                        this.acceptMessage(e);
                        break;
                    }
                    case 'starting': 
                    default: break;
            }
        }


        this._sipuri = 'sip:'+this._user+'@'+this._domain;
        this._sipStack = new SIPml.Stack({
            realm: this._domain, // obligatorio: nombre de dominio
            impi: this._user, // obligatorio: nombre de usuario
            impu: this._sipuri, // obligatorio: SIP uri valida
            password: this._secret, // opcional: sip secret
            display_name: this._callerid, // opcional: identificador del llamante
            websocket_proxy_url: 'wss://'+this._domain+':8089/asterisk/ws', //opcional
            //outbound_proxy_url: 'udp://'+this._domain+':5060', // opcional
            enable_rtcweb_breaker: false, // opcional
            events_listener: { events: '*', listener: this._eventListener }, // opcional: '*' significa todo los eventos
            ice_servers: [{url:'stun:stun.l.google.com:19302'}],
            enable_media_stream_cache: true,
            sip_caps: [
                            { name: '+g.oma.sip-im' },
                            { name: '+sip.ice' },
                            { name: 'language', value: '\"en,fr\"' }
                    ],
            sip_headers: [
                                { name: 'User-Agent', value: 'Anywhere-MyBC/Beta 1.0' },
                                { name: 'Organization', value: 'Tmsoft SAS' }                
            ]
        });
        this._sipStack.start();
    }

    private login(){
        this._callListener = e => {
                console.log('call event **** **** =' + e.type);
                switch (e.type) {
                    // Display in the web page That is connecting the call
                    case 'connected': case 'connecting': {
                        var bconnected = (e.type == 'connected');
                        if (e.session == this._session) {
                            this.emitRequestMsg(e.description);
                        } else  if (e.type == 'connecting') {
                            console.log("Evento Call connecting");
                            this.emitRequestMsg(e.description);
                        } else if (e.session == this._session) {
                            if (bconnected) {
                                this.emitConnectedEvent(e.description);
                            }
                        }
                        break;
                    }

                    // In the browser Display teh call is finished
                    case 'terminated': 
                    case 'terminating': {

                        this._session = null;
                        this.emitTerminateEvent(e);
                        break;

                    }

                    // Future use with video
                    case 'm_stream_video_local_added': {
                        if (e.session == this._session) {

                        }
                        break;
                    }

                    // Future use with video
                    case 'm_stream_video_local_removed': {
                        if (e.session == this._session) {

                        }
                        break;
                    }

                    // Future use with video
                    case 'm_stream_video_remote_added': {
                        if (e.session == this._session) {

                        }
                        break;
                    }

                    // Future use with video
                    case 'm_stream_video_remote_removed': {
                        if (e.session == this._session) {

                        }
                        break;
                    }

                    // Added all messaging media audio
                    case 'm_stream_audio_local_added':
                    case 'm_stream_audio_local_removed':
                    case 'm_stream_audio_remote_added':
                    case 'm_stream_audio_remote_removed': {

                        this.stopRingTone();
                        this.stopRingbackTone();

                        break;
                    }

                    // If the remote end send us a request With 18X SIPresponse to start ringing
                    case 'i_ao_request': {
                        var iSipResponseCode = e.getSipResponseCode ();
                        if (iSipResponseCode  == 180 || iSipResponseCode  == 183) {
                            this._session = e.newSession;
                            this.emitIncomingcallEvent(e);
                        }
                        break;
                    }

                    // If the remote send early media stop the sounds
                    case 'm_early_media': {
                        if (e.session == this._session) {
                            this.emitAnswerEvent(e);
                        }
                        break;
                    }
                }

        }
        this._registerSession = this._sipStack.newSession('register', {
            events_listener: { events: '*', listener: this._callListener }
        });
        this._registerSession.register();
    }

    public dial(e:string){
        this.makeCall(e);
    }

    public answer(e){
        this.acceptCall(e);
    }

    public reject(e){
        this.rejectCall(e);
    }

    private makeCall(e:string){
        this._session = this._sipStack.newSession('call-audio', {
            audio_remote: document.getElementById("audio_remote"),
            video_remote: document.getElementById("video_remote")
        });
        this._session.call(e);
    }

    private acceptCall(e:any){
        console.log('Evento Aceptando llamada...');
        this._session.accept({
                        audio_remote: document.getElementById('audio_remoto'),
                        audio_local: document.getElementById('audio_local'),
                        events_listener: { events: '*', listener: this._callListener } // optional '*' Means all events
                    });        
    }

    private rejectCall(e:any){
        this._session.reject();
    }

    private acceptMessage(e:any){
        this._session.accept();
        console.info('Message: ' + e.getContentString() + ' and Type: ' + e.getContentType());
    }

    private rejectMessage(e:any){
        this._session.reject();
    }

    private sendMessage(e:string, m:string){
        var eventsListener = e => {
            console.info('message session event: ' + e.type);
        }

        var messageSession = this._sipStack.newSession('message', {
            events_listener: { events: '*', listener: eventsListener}
        })

        messageSession.send(e,m,'text/plain;charset=utf-8');
    }

    public hangup(){
        this._session.hangup();
        this.emitEndedEvent();
    }

    public togglemute(){
        var options = this._session.isMuted();
        console.log('toggle mute:'+ JSON.stringify(options));
        if (options.audio === true){
            console.log('to unmute');
            this._session.unmute({audio: true});
        } else {
            console.log('to mute');
            this._session.mute({audio: true});
        }
    }

    public togglehold(){
        var options = this._session.isOnHold();
        console.log('toggle hold:'+ JSON.stringify(options));
        var result:boolean;
        if (options.local){
            result = this._session.unhold();
            if (result) {
                this.emitUnholdEvent();
            }
        } else {
            result = this._session.hold();
            if (result) {
                this.emitHoldEvent();
            }
        }
    }

    public togglevideo(){
        var options = this._session.isMuted();
        console.log('toggle video:'+ JSON.stringify(options));
        if (options.video === true){
            console.log('to with video');
            this._session.unmute({video: true});
        } else {
            console.log('to without video');
            this._session.mute({video: true});
        }
    }

    public transfer(data:string){
        this._session.refer(data);
    }

    // Play audio
    public startRingTone(){
        this.audioPlayer.play('ringback',1);
    }

    public startRingbackTone(){
        this.audioPlayer.play('ringback',1);
    }

    public startRejected(){
  		this.audioPlayer.play('rejected',1);
    }

    public stopRingbackTone(){
        this.audioPlayer.stop('ringback');
    }

    public stopRingTone(){
        this.audioPlayer.stop('ring');
    }

    public stopRejected(){
        this.audioPlayer.stop('rejected');
    }          



    // Emit Events

    public emitTerminateEvent(e:string){
        console.log('Evento Terminate...');
        this.stopRingbackTone();
        this.stopRingTone();        
    }

    public emitRequestMsg(e:string){
        console.log('Evento RequestMessage...'+e);
    }

    public emitUnRegisterEvent(e:string){
        console.log('Evento unregister...'+e);
    }

    public emitTryToConnect(e:string){
        console.log('Evento Try Conenct...'+e);
    }

    public emitConnectedEvent(e:string){
        console.log('Evento Connected...'+e);
        this.stopRingbackTone();
        this.stopRingTone();
    }

    public emitRefusedEvent(e:string){
        console.log('Evento Refused...'+e);        
        this.stopRingTone();
        this.stopRingbackTone();
    }

    public emitRemoteStreamEvent(stream:any){
        console.log('Evento Remote Stream...');
        this.remoteStreamCall$.emit(stream);
    }    

    public emitProgressEvent(e:any) {
        console.log('Evento Progress...');
        this.progressCall$.emit(e);
    }

    public emitFailedEvent(e:any){
        console.log('Evento Failed...');        
        this.stopRingTone();
        this.startRejected();
        this.failedCall$.emit(e);
    }

    public emitAnswerEvent(e:any){
        console.log('Evento Anwer...');        
        this.answerCall$.emit(e);
    }

    public emitConfirmedEvent(e:any) {
        console.log('Evento Confirmed...');
        this.confirmedCall$.emit(e);
    }

    public emitEndedEvent() {
        console.log('Evento Ended...');        
        this.audioPlayer.stop('ringback');
        this._session = null;
        this.endedCall$.emit();
    }

    public emitSucceededEvent(e:any){
        console.log('Evento Succeeded...');        
        this.succeededCall$.emit(e);
    }

    public emitHoldEvent(){
        this.holdCall$.emit({'result':true});
    }

    public emitUnholdEvent(){
        this.unholdCall$.emit({'result':true});
    }    

    public emitMuteEvent(){
        this.muteCall$.emit({'result':true});
    }

    public emitUnmuteEvent(){
        this.unmuteCall$.emit({'result':true});
    }

    public emitIncomingcallEvent(e:any){
        console.log('Evento Inconming...'+e.description);        
        this.startRingbackTone();
        this.incomingCall$.emit(e);
    }  

}
