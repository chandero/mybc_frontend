import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { WindowRefService } from '../services/windowref.service';
import { User } from '../models/user.model';

@Injectable()
export class LoginService {

  private _baseUrl: string;
  private _window: any;

  constructor(windowRef: WindowRefService, private _http: Http) { 
       this._window = windowRef.nativeWindow;
  }

  getUserdata(username: String): Observable<User> {
    this._baseUrl = `${this._window.location.protocol}//${this._window.location.hostname}:${this._window.location.port}/api`;
    console.log('base url identify:' + this._baseUrl);
    return this._http.get(this._baseUrl + '/signin/' + username)
      .map(this.extractUser)
      .catch(this.handleError);
  }

  validateSignIn(username: string, password: string): Observable<User> {
    this._baseUrl = `${this._window.location.protocol}//${this._window.location.hostname}:${this._window.location.port}/api`;
    console.log('base url password:' + this._baseUrl);
    return this._http.get(this._baseUrl + '/verify/' + username + '/' + password)
      .map(this.extractUser)
      .catch(this.handleError);
  }


  private extractUser(res: Response) {
    var user: User;
    if (res.status == 401) {
      user = new User();
      user.exte_estado = false;
    } else {
      user = res.json();
    }
    return user || {};
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