import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { WindowRefService } from '../services/windowref.service';
import { Contact } from '../models/contact.model';


@Injectable()
export class ContactService {

    private _baseUrl: string;
    private _window: Window;

    constructor(windowRef: WindowRefService, private _http: Http) { 
        this._window = windowRef.nativeWindow;
    }

    getContactData(){
        this._baseUrl = `${this._window.location.protocol}//${this._window.location.hostname}:${this._window.location.port}/api`;
        console.log('base url:' + this._baseUrl);
        return this._http.get(this._baseUrl + '/contact/getList/'+localStorage.getItem('mybcexten'))
            .map(((res: Response) => <Contact[]>res.json()))
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
        console.error(errMsg);
        return Observable.throw(errMsg);
    }    

}