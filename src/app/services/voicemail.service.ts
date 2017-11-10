import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { WindowRefService } from '../services/windowref.service';
import { Voicemail } from '../models/voicemail.model';

@Injectable()
export class VoicemailService {

    private _baseUrl: string;
    private _window: Window;

    constructor(windowRef: WindowRefService, private _http: Http) { 
        this._window = windowRef.nativeWindow;
    }

    getVoicemailData(extension: String): Observable<Voicemail[]> {
        this._baseUrl = `${this._window.location.protocol}//${this._window.location.hostname}:${this._window.location.port}/api`;
        var get = this._baseUrl + '/voicemail/getlist/'+extension;
        console.log('procesando peticion voicemail:'+get);
        return this._http.get(get).map(((res: Response) => <Voicemail[]>res.json()))
            .map((voicemails : Array<any>) => {
                let result:Array<Voicemail> = [];
                if (voicemails){
                    voicemails.forEach((voicemail) => {
                        console.log("Voicemail: "+ voicemail.voic_file );
                        let v:Voicemail = new Voicemail();
                        v.voic_id = voicemail.voic_id;
                        v.voic_file = this._baseUrl + "/voicemail/get/"+extension+"/"+voicemail.voic_file; //asignar servlet 
                        v.voic_origin = voicemail.voic_origin;
                        v.voic_date = voicemail.voic_date;
                        v.voic_duration = voicemail.voic_duration;
                        result.push(v);
                    })
                }
                return result;
            })
            .catch(this.handleError);
    }

    private handleError(error: Response | any) {
        // In a real world app, you might use a remote logging infrastructure
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.log('Error:'+errMsg);
        console.error(errMsg);
        return Observable.throw(errMsg);
    }

    downloadFile(url:string){
        this._window.open(url, "_blank");
    }
}