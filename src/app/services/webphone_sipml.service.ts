import { EventEmitter, Injectable, ViewContainerRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AudioPlayerService } from './audioplayer.service';
import { WindowRefService } from '../services/windowref.service';
import { environment } from '../../environments/environment';

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
    public registryExten$:EventEmitter<any>;
    public unregistryExten$:EventEmitter<any>;
    public tryregistryExten$:EventEmitter<any>;

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

    private _oConfigCall:any;

    private _window: Window;

    private _isAudioMute:boolean = false;
    private _isVideoMute:boolean = false;
    private _isOnHold:boolean = false;

    private _inCall:boolean = false;
    private _ringing:boolean = false;
    private _currentNumber:String= "";
    private _currentCaller:String= "";

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
        this.registryExten$ = new EventEmitter<any>();
        this.tryregistryExten$ = new EventEmitter<any>();
        this.unregistryExten$ = new EventEmitter<any>();

        if (environment.production){
            this._domain = `${this._window.location.hostname}`;
            this._user = localStorage.getItem('mybcexten');
            this._secret = localStorage.getItem('mybcsecret');
        } else {
            this._domain = 'mybc.anw.cloud';
            this._user = '2022';
            this._secret = '2Ci(C9-s';
        }

	    SIPml.setDebugLevel('fatal');
        this.startRegister();
    }

    private startRegister(){
        var readyCallback = e => {
            this.createSipStack();
        }
        var errorCallback = e => {
            console.log('Evento:-->Fállo al inicializar SIPml:  ' + e.message);
        }
        SIPml.init( readyCallback, errorCallback );
    }

    private createSipStack(){
        this._eventListener = e => {
            console.log('EventListener:-->call event **** **** = "' + e.type +'"');
            console.log("EventListener:-->actual session = "+this._session);
            console.log("EventListener:-->new session "+ e.newSession);
            console.log("EventListener:-->session " + e.session);            
            switch (e.type) {
                    case 'failed_to_start': case 'failed_to_stop': case 'stopping': case 'stopped': {

                        console.log("Evento: Failed to connect to SIP SERVER")
                        this._session = null;
                        this._sipStack = null;
                        this._registerSession = null;
                        this.emitUnRegisterEvent('No se pudo realizar el registro');
                        break;
                    }
                    case 'started': {
                        console.log("Evento: Trying to Login");
                        this.login(); // function to login in sip server
                        this.emitTryToConnect('Registrando...');
                        break;
                    }
                    case 'connected': {
                        console.log("Evento: Registrado con Sip Server");
                        this.emitRegisterEvent('Registrado con Sip Server');
                        break;
                    }
                    case 'sent_request': {
                        console.log("Evento: sent_request");
                        this.emitRequestMsg(e.description);
                        break;
                   }
                   case 'terminated': {
                        console.log("Evento: terminated");
                        this.emitRequestMsg(e.description);
                        break;
                   }
                   case 'i_new_call': {
                        if (this._session) {
                            // Do not accept the incoming call if we're Already 'in call'
                            e.newSession.hangup(); // Comment this line for multi-line support
                        } else {
                            if (e.newSession != undefined ) {
                                this._session = e.newSession;
                                // Display web page in the WHO is calling
                                console.log('Evento: Incoming number: '+this._session.getRemoteFriendlyName());
                                var sRemoteNumber = (this._session.getRemoteFriendlyName() || 'Desconocido');
                                this.emitIncomingcallEvent(sRemoteNumber);
                            }
                        }
                        break;
                   }
                   case 'm_permission_requested': {
                        break;
                   }
                   case 'm_permission_accepted':{
                        break;
                   }
                   case 'm_permission_refused': {
                            this._session = null;
                            this.emitRefusedEvent(e.description);
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
                console.log('Call:-->call event **** **** = "' + e.type +'"');
                console.log("Call:-->actual session = "+this._session);
                console.log("Call:-->new session "+ e.newSession);
                console.log("Call:-->e session " + e.session);
                switch (e.type) {
                    // Display in the web page That is connecting the call
                    case 'connected': case 'connecting': {
                        var bconnected = (e.type == 'connected');
                        if (e.type == 'connecting') {
                            console.log("Call:-->connecting");
                            this.emitRequestMsg(e.description);
                        } else if (e.session == this._session) {
                            console.log("Call:-->: en evento connected");
                            this.emitRequestMsg(e.description);
                            if (bconnected) {
                                console.log("Call:-->: Emitiendo el evento connected");
                                 this.emitConnectedEvent(e.description);
                            }
                        }
                        break;
                    }

                    // In the browser Display teh call is finished
                    case 'terminated':
                    case 'terminating': {
                        console.log('Call Canceled');
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
                        this._ringing = false;

                        break;
                    }

                    // If the remote end send us a request With 18X SIPresponse to start ringing
                    case 'i_ao_request': {
                        var iSipResponseCode = e.getSipResponseCode ();
                        console.log('Call:-->i_ao_request :'+ iSipResponseCode);
                        if (iSipResponseCode  == 180 || iSipResponseCode  == 183) {
                            console.log('Call:-->new Session: '+ e.newSession);
                            console.log('Call:-->new Session / session: '+ e.session);
                            this._session = e.newSession;
                            this.emitRingbackEvent(e);
                        }
                        break;
                    }

                    // If the remote send early media stop the sounds
                    case 'm_early_media': {
                        this._session = e.session;
                        if (e.session == this._session) {
                            this.emitAnswerEvent(e);
                        }
                        break;
                    }

                   case 'm_permission_requested': {
                        break;
                   }
                   case 'm_permission_accepted':{
                        break;
                   }
                   case 'm_permission_refused': {
                            this._session = null;
                            this.emitRefusedEvent(e.description);
                        break;
                    }
                }

        }

        this._oConfigCall = {
                audio_remote:  document.getElementById("audio_remote"),
                video_local: document.getElementById("video_local"),
                video_remote:  document.getElementById("video_remote"),
                screencast_window_id: 0x00000000, // entire desktop
                bandwidth: { audio: undefined, video: undefined },
                video_size: { minWidth: undefined, minHeight: undefined, maxWidth: undefined, maxHeight: undefined },
                events_listener: { events: '*', listener: this._callListener },
                sip_caps: [
                                { name: '+g.oma.sip-im' },
                                { name: 'language', value: '\"en,fr\"' }
                ]
            };

        this._registerSession = this._sipStack.newSession('register', {
            events_listener: { events: '*', listener: this._eventListener } // cambié el callListener por eventListener
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
        this._session = this._sipStack.newSession('call-audio', this._oConfigCall);
        this.emitProgressEvent(e);
        this._currentNumber = e;
        if (this._session.call(e) != 0) {
            this._session = null;
            this.emitEndedEvent();
            return;
        }
    }

    public sendDtmfTone(e:string){
        if (this._session != null){
            this.playTone(e);
            this._session.dtmf(e);
        }
    }

    private acceptCall(e:any){
        console.log('acceptCall:-->Evento Aceptando llamada...');
        this._session.accept(this._oConfigCall);
    }

    private rejectCall(e:any){
        console.log('Service: rechazando llamada...'+JSON.stringify(e))
        this._session.reject();
    }

    private acceptMessage(e:any){
        this._session.accept();
        console.log('acceptMessage:-->Message: ' + e.getContentString() + ' and Type: ' + e.getContentType());
    }

    private rejectMessage(e:any){
        this._session.reject();
    }

    private sendMessage(e:string, m:string){
        var eventsListener = e => {
            console.log('sendMessage:-->message session event: ' + e.type);
        }

        var messageSession = this._sipStack.newSession('message', {
            events_listener: { events: '*', listener: eventsListener}
        })

        messageSession.send(e,m,'text/plain;charset=utf-8');
    }

    public hangup(){
        this.stopRingTone();
        this.stopRingbackTone();
        this._session.hangup({events_listener: {events: '*' , listener: this._callListener}});
    }

    public togglemute(){
        console.log('Mute:-->toggle mute:'+ JSON.stringify(this._isAudioMute));
        if (this._isAudioMute === true){
            console.log('Mute:-->to unmute');
            this._isAudioMute = false;
            this._session.mute("audio", false);
            this.emitUnmuteEvent();
        } else {
            console.log('Mute:-->to mute');
            this._isAudioMute = true;
            this._session.mute("audio",true);
            this.emitMuteEvent();
        }
    }

    public togglehold(){

        console.log('Mute:-->toggle hold:'+ JSON.stringify(this._isOnHold));
        var result:number;
        if (this._isOnHold){
            result = this._session.resume();
            if (result === 0) {
                this.emitUnholdEvent();
            }
        } else {
            result = this._session.hold(this._oConfigCall);
            if (result === 0) {
                this.emitHoldEvent();
            }
        }
    }

    public togglevideo(){
        var options = this._session.isMuted();
        console.log('Mute:-->toggle video:'+ JSON.stringify(options));
        if (options.video === true){
            console.log('Mute:-->to with video');
            this._session.unmute({video: true});
        } else {
            console.log('Mute:-->to without video');
            this._session.mute({video: true});
        }
    }

    public transfer(data:string){
        this._session.transfer(data);
    }

    // Play audio
    private playTone(e:string){
        this.audioPlayer.playandstop('dtmf-'+e,1);
    }

    public startRingTone(){
        this.audioPlayer.play('ringing',1);
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
        this.audioPlayer.stop('ringing');
    }

    public stopRejected(){
        this.audioPlayer.stop('rejected');
    }



    // Emit Events

    public emitTerminateEvent(e:string){
        console.log('Emit:-->Evento Terminated...');
        this.stopRingbackTone();
        this.stopRingTone();
        this._ringing = false;
        this._inCall = false;
        this.endedCall$.emit(e);
    }

    public emitRequestMsg(e:string){
        console.log('Emit:-->Evento RequestMessage...'+e);
    }

    public emitUnRegisterEvent(e:string){
        console.log('Emit:-->Evento unregister...'+e);
        this.unregistryExten$.emit(e);
    }

    public emitTryToConnect(e:string){
        console.log('Emit:-->Evento Try Conenct...'+e);
        this.tryregistryExten$.emit(e);
    }

    public emitConnectedEvent(e:string){
        console.log('Emit:-->Evento Connected...'+e);
        this.stopRingbackTone();
        this.stopRingTone();
        this.answerCall$.emit(e);
    }

    public emitRefusedEvent(e:string){
        console.log('Emit:-->Evento Refused...'+e);
        this.stopRingTone();
        this.stopRingbackTone();
    }

    public emitRemoteStreamEvent(stream:any){
        console.log('Emit:-->Evento Remote Stream...');
        this.remoteStreamCall$.emit(stream);
    }

    public emitProgressEvent(e:any) {
        this.startRingTone();
        this.progressCall$.emit(e);
    }

    public emitFailedEvent(e:any){
        console.log('Emit:-->Evento Failed...');
        this.stopRingTone();
        this.startRejected();
        this.failedCall$.emit(e);
    }

    public emitAnswerEvent(e:any){
        console.log('Emit:-->Evento Answer...');
        this.stopRingTone();
        this.stopRingbackTone();
        this._ringing = false;
        this._inCall = true;
        this.answerCall$.emit(e);
    }

    public emitConfirmedEvent(e:any) {
        console.log('Emit:-->Evento Confirmed...');
        this.confirmedCall$.emit(e);
    }

    public emitEndedEvent() {
        console.log('Emit:-->Evento Ended...');
        this.stopRingbackTone();
        this.stopRingTone();
        this._session = null;
        this.endedCall$.emit();
    }

    public emitSucceededEvent(e:any){
        console.log('Emit:-->Evento Succeeded...');
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
        console.log('Emit:-->Evento Inconming...'+e);
        this.stopRingbackTone();
        this.stopRingTone();
        this.startRingbackTone();
        this._ringing = true;
        this.incomingCall$.emit(e);
    }

    public emitRingbackEvent(e:any){
        console.log('Emit:-->Evento Ringback...'+e.description);
        if (this._currentNumber === ''){
            this.stopRingbackTone();
            this.stopRingTone();
            this.startRingbackTone();
        }
    }

    public emitRegisterEvent(e:any){
        this.registryExten$.emit(e);
    }

}
