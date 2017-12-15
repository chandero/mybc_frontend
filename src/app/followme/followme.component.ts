import { Component, OnInit } from '@angular/core';
import { FollowmeService } from '../services/followme.service';
import { Followme } from '../models/followme.model';

@Component({
  selector: 'app-followme',
  templateUrl: './followme.component.html',
  styleUrls: ['./followme.component.css']
})
export class FollowmeComponent implements OnInit {

  private _extension: string = localStorage.getItem('mybcexten');
  private _followme: Followme = new Followme();
  private _errorMessage: any;

  constructor(private service: FollowmeService) { 
    service.getSiguemeData(this._extension).subscribe(followme => this.procesarData(followme)),
    error => this._errorMessage = <any> error;
  }

  procesarData(data: Followme){
    this._followme.sigu_id = data.sigu_id;
    this._followme.sigu_extlist = data.sigu_extlist;
    this._followme.sigu_activo = data.sigu_activo;
    this._followme.procesarLista();
  }

  ngOnInit() {

  }

  validateKey(event: KeyboardEvent){
    switch(event.key){
      case '0':
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
      case '+':
          break;
      default:
          event.preventDefault();
    }
  }

  private setStatusEvent(event){
    this.setFollowmeStatus(this._followme.sigu_activo);
  }

  setFollowmeStatus(status: boolean){
    var _result: boolean;
    if (this._followme.sigu_id > 0) {
    this.service.setSiguemeStatus(this._extension, status).subscribe(result => this.validarStatus(result)),
                   error => this._errorMessage = <any> error;
    }
  }

  validarStatus(result: boolean){
    if (result){
      this.getFollowmeStatus();
    }
  }

  getFollowmeStatus(){
    this.service.getSiguemeStatus(this._extension).subscribe(status => this.setStatus(status)),
                  error => this._errorMessage = <any> error;
  }

  private setStatus(status: boolean){
    this._followme.sigu_activo = status;
  }

  private setData(){
    this._followme.empaquetarLista();
    this.service.setSiguemeData(this._extension, this._followme).subscribe(res => console.log("res:"+res));
  }

}
