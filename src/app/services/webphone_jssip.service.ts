import { EventEmitter, Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AudioPlayerService } from './audioplayer.service';
import { ElementRef, ViewChild } from '@angular/core';
import { WindowRefService } from '../services/windowref.service';

declare var JsSIP: any;

export class call {
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
export class WebphoneJsSIPService {

    //@ViewChild('audioRemote') remoteAudio:ElementRef;

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

    private remoteAudio: any;

    private _window: Window;

	private state =
		{
			// 'connecting' / disconnected' / 'connected' / 'registered'
			status          : 'disconnected',
			session         : null,
			incomingSession : null
		};    

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

        this.remoteAudio = new Audio();

        this.startRegister();
    }

    private startRegister(){

    this._domain = `${this._window.location.hostname}`;
    this._user = localStorage.getItem('mybcexten');
    this._secret = localStorage.getItem('mybcsecret');
    this._socket = new JsSIP.WebSocketInterface('wss://'+this._domain+':8089/asterisk/ws');
    this._configuration = {
        "display_name":this._user,
        "sockets"  : [ this._socket ],
        "uri"      : this._user+'@'+this._domain,
        "password" : this._secret,
        "registrar_server" : null,
        "contact_uri":null,
	    "authorization_user":null,
	    "instance_id":null,
	    "session_timers":true,
	    "use_preloaded_route":false,
	    "pcConfig":{
		    "rtcpMuxPolicy":"negotiate",
		    "iceServers":[{"urls":["stun:stun.l.google.com:19302"]}]
            },
		"callstats":{"enabled":false,"AppID":null,"AppSecret":null},
        "trace_sip": false,
    };
    this._sip = new JsSIP.UA(this._configuration);
    
    this._sip.on('connecting', e => {
        console.log('this._sip connecting -- line 101');
    });

    this._sip.on('connected', e => {
        console.log('this._sip connected-- line 105');
    });

    this._sip.on('disconnected', e => {
        console.log('this._sip connecting -- line 109');
    });

    this._sip.on('registered', e => {
        console.log('this._sip registered -- line 113');
    });

    this._sip.on('unregistered', e => {
        console.log('this._sip unregistered -- line 117');
    });

    this._sip.on('registrationFailed', e => {
        console.log('this._sip registrationFailed -- line 126');
    });

    this._sip.on('newRTCSession', e => {
        console.log('this._sip newRTCSession -- line 130');
			if (e.originator === 'local')
				return;

            let session = e.session;
            if (this.state.session || this.state.incomingSession) {
				console.debug('incoming call replied with 486 "Busy Here -- line 131"');

				session.terminate(
					{
						status_code   : 486,
						reason_phrase : 'Busy Here'
					});

				return;
			}
            this.audioPlayer.play('ringing',1);
            this.state.incomingSession = session;
            this.emitIncomingcallEvent(session);
            session.on('failed', e =>
			{
                console.log('Failed Incoming Call -- line 146');
				this.audioPlayer.stop('ringing');
                this.audioPlayer.stop("rejected");
				this.state.session = null;
                this.state.incomingSession = null;
			});

			session.on('ended', () =>
			{
                console.log('Ended Incoming Call -- line 154');
                this.audioPlayer.stop("rejected");
                this.state.session = null;
                this.state.incomingSession = null;
			});

			session.on('accepted', () =>
			{
                console.log('Accepted Incoming Call -- line 161');
				this.audioPlayer.stop('ringing');
                
                this.state.session = session;
                this.state.incomingSession = null;
                this.emitAnswerEvent(session);
			});

            session.on('addstream', e => {
                console.log('AddStream -- line 169');
                this.remoteAudio.nativeElement.src = window.URL.createObjectURL(e.stream);
                this.emitRemoteStreamEvent(e.stream);
            });

            session.on('peerconnection', e => {
                 console.log('peerconnection -- line 180');
                 e.peerconnection.addEventListener('addstream', e => {
                    console.log('AddStream -- line 181');
                    this.remoteAudio.srcObject = e.stream;
                    this.remoteAudio.play();
                 });
            });

    });        
    
    this._sip.start();

    // Register callbacks to desired call events
    this._eventHandlers = {
      'connecting': e => {
            console.log('sip call -- connecting -- line 180');
      },
      'progress': e => {
            console.log('sip call -- progress -- line 183');
            this.emitProgressEvent(e);
      },
      'failed': e => {
                    console.log('sip call -- failed -- line 187');     
                    this.audioPlayer.stop("rejected");     
                    this.emitFailedEvent(e);
                },
      'ended': e =>  {
                    console.log('sip call -- ended -- line 191');     
                    this.audioPlayer.stop("rejected");     
                    this.emitEndedEvent(e);
                },
      'confirmed': e => {
                     console.log('sip call -- confirmed -- line 195');
                    this.emitConfirmedEvent(e);
                   },
      'succeeded': e => { 
                     console.log('sip call -- succeeded -- line 199');
                    this.emitSucceededEvent(e);
                },
      'addstream': e => {
                    let urlStream = window.URL.createObjectURL(e.stream);
                    console.log("sip call -- addstream -- line 203: url:"+ urlStream);     
                    this.remoteAudio.nativeElement.src = urlStream;     
                    this.emitRemoteStreamEvent(e.stream);
      },
      'accepted': e => {
            console.log('sip call -- accepted -- line 223');          
			this.audioPlayer.stop('ringback');
      }, 
      'peerconnection': e => {
        console.log('sip call -- peerconnection -- line 227');  
        e.peerconnection.addEventListener('addstream', e => {
                    console.log('AddStream -- line 229');
                    this.remoteAudio.srcObject = e.stream;
                    this.remoteAudio.play();
                 }); 
      }
    };

    this._options = {
      'eventHandlers'    : this._eventHandlers,
      'mediaConstraints' : { 'audio': true, 'video': true },
      'rtcOfferConstraints' : { offerToReceiveAudio : 1, offerToReceiveVideo : 1 }
    };
        
    }

    public dial(dialnumber:string){
        var sipstring:string = "sip:"+dialnumber+"@"+this._domain;
        this._session = this._sip.call(sipstring, this._options);
    }

    public answer(e:any) {
        this.state.incomingSession.answer();
    }

    public reject(e:any){
        this._sip.terminateSessions();
    }

    public hangup(){
        this._sip.terminateSessions();
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

    



    // Emit events

    public emitRemoteStreamEvent(stream:any){
        this.remoteStreamCall$.emit(stream);
    }    

    public emitProgressEvent(e:any) {
        this.audioPlayer.play('ringback',1);
        this.progressCall$.emit(e);
    }

    public emitFailedEvent(e:any){
        this.audioPlayer.stop('ringback');
		this.audioPlayer.play('rejected',1);
        this.failedCall$.emit(e);
    }

    public emitAnswerEvent(e:any){
        this.answerCall$.emit(e);
    }

    public emitConfirmedEvent(e:any) {
        this.confirmedCall$.emit(e);
    }

    public emitEndedEvent(e:any) {
        this.audioPlayer.stop('ringback');
        this._session = null;
        this.endedCall$.emit(e);
    }

    public emitSucceededEvent(e:any){
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
        this.incomingCall$.emit(e);
    }

}