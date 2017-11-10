import { EventEmitter, Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AudioPlayerService {

        private _initialized:boolean = false;

        private FILES: any;

        private SOUNDS: any;  

    constructor(private http:Http){
		this.http.get('assets/js/sounds.json')
             .subscribe(res => this.initialize(res));
    }


    private initialize(res : any){
		this.FILES = res.json()
		this.SOUNDS = new Map(
		[
			[ 'ringback', { audio: new Audio(this.FILES['ringback']), volume: 1.0 } ],
			[ 'ringing',  { audio: new Audio(this.FILES['ringing']),  volume: 1.0 } ],
			[ 'answered', { audio: new Audio(this.FILES['answered']), volume: 1.0 } ],
			[ 'rejected', { audio: new Audio(this.FILES['rejected']), volume: 0.5 } ],
			[ 'dtmf-0' ,  { audio: new Audio(this.FILES['dtmf-0']),   volume: 1.0 } ],
			[ 'dtmf-1' ,  { audio: new Audio(this.FILES['dtmf-1']),   volume: 1.0 } ],
			[ 'dtmf-2' ,  { audio: new Audio(this.FILES['dtmf-2']),   volume: 1.0 } ],
			[ 'dtmf-3' ,  { audio: new Audio(this.FILES['dtmf-3']),   volume: 1.0 } ],
			[ 'dtmf-4' ,  { audio: new Audio(this.FILES['dtmf-4']),   volume: 1.0 } ],
			[ 'dtmf-5' ,  { audio: new Audio(this.FILES['dtmf-5']),   volume: 1.0 } ],
			[ 'dtmf-6' ,  { audio: new Audio(this.FILES['dtmf-6']),   volume: 1.0 } ],
			[ 'dtmf-7' ,  { audio: new Audio(this.FILES['dtmf-7']),   volume: 1.0 } ],
			[ 'dtmf-8' ,  { audio: new Audio(this.FILES['dtmf-8']),   volume: 1.0 } ],
			[ 'dtmf-9' ,  { audio: new Audio(this.FILES['dtmf-9']),   volume: 1.0 } ],
			[ 'dtmf-*' ,  { audio: new Audio(this.FILES['dtmf-*']),   volume: 1.0 } ],
			[ 'dtmf-#' ,  { audio: new Audio(this.FILES['dtmf-#']),   volume: 1.0 } ],
		]);

		if (this._initialized)
			return;
        
        this.SOUNDS.forEach((sound: any, key: string) =>
		{
			sound.audio.volume = 0;

			try { sound.audio.play(); } catch (error) {}
        });

		this._initialized = true;
	}        
    
    public play(name:string, relativeVolume: number){

		if (typeof relativeVolume !== 'number')
			relativeVolume = 1.0;

		let sound = this.SOUNDS.get(name);

		if (!sound)
			throw new Error(`unknown sound name "${name}"`);

		
		try
		{
			console.debug('play() [name:%s]', name);
			sound.audio.pause();
			sound.audio.currentTime = 0.0;
			sound.audio.volume = (sound.volume || 1.0) * relativeVolume;
			sound.audio.addEventListener('ended', e => {
				sound.audio.currentTime = 0.0;
				sound.audio.play();
			})
			sound.audio.play();
		}
		catch (error)
		{
			console.warn('play() | error: %o', error);
		}

	}
	
	public playandstop(name:string, relativeVolume: number){
		if (typeof relativeVolume !== 'number')
			relativeVolume = 1.0;

		let sound = this.SOUNDS.get(name);

		if (!sound)
			throw new Error(`unknown sound name "${name}"`);

		
		try
		{
			console.debug('play() [name:%s]', name);
			sound.audio.pause();
			sound.audio.currentTime = 0.0;
			sound.audio.volume = (sound.volume || 1.0) * relativeVolume;
			sound.audio.play();
		}
		catch (error)
		{
			console.warn('play() | error: %o', error);
		}		
	}

    public 	stop(name)
	{
		console.debug('stop() [name:%s]', name);

		let sound = this.SOUNDS.get(name);

		if (!sound)
			throw new Error(`unknown sound name "${name}"`);

		sound.audio.pause();
		sound.audio.currentTime = 0.0;
	}

}