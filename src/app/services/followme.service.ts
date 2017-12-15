import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { WindowRefService } from '../services/windowref.service';
import { Followme } from '../models/followme.model';

@Injectable()
export class FollowmeService {

    private _baseUrl: string;
    private _window: Window;
    private _status: boolean;

    constructor(windowRef: WindowRefService, private _http: Http) {
        this._window = windowRef.nativeWindow;
    }

    public setSiguemeStatus(extension:string, status:boolean){
        this._baseUrl = `${this._window.location.protocol}//${this._window.location.hostname}:${this._window.location.port}/api`;
        const get = this._baseUrl + '/followme/setstatus/' + extension + '/' + status;
        console.log('procesando peticion establecer estado de sigueme');
        return this._http.get(get).map(((res: Response) => <boolean>res.json()))
            .map((status: boolean ) => {
                return status;
            })
            .catch(this.handleError);
    }

    public getSiguemeStatus(extension:string): Observable<boolean> {
      this._baseUrl = `${this._window.location.protocol}//${this._window.location.hostname}:${this._window.location.port}/api`;
      const get = this._baseUrl + '/followme/getstatus/' + extension;
      console.log('procesando peticion estado de followme');
      return this._http.get(get).map(((res: Response) => <boolean>res.json()))
          .map((status: boolean)  => {
              console.log("Estado recibido: "+ status);
              return status;
          })
          .catch(this.handleError);
    }

    public getSiguemeData(extension: String): Observable<Followme> {
        this._baseUrl = `${this._window.location.protocol}//${this._window.location.hostname}:${this._window.location.port}/api`;
        var get = this._baseUrl + '/followme/get/'+extension;
        console.log('procesando peticion followme:'+get);
        return this._http.get(get).map(((res: Response) => <Followme>res.json()))
            .catch(this.handleError);
    }

    public setSiguemeData(extension: string, followme: Followme){
        this._baseUrl = `${this._window.location.protocol}//${this._window.location.hostname}:${this._window.location.port}/api`;
        var post = this._baseUrl + '/followme/setdata';
        return this._http.post(post, followme).map((res:Response) => <Boolean>res.json());
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
}
