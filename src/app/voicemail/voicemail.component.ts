import { Component, OnInit } from '@angular/core';
import { VoicemailService } from '../services/voicemail.service';

@Component({
  selector: 'app-voicemail',
  templateUrl: './voicemail.component.html',
  styleUrls: ['./voicemail.component.css']
})
export class VoicemailComponent implements OnInit {

  private _voicemails : {};
  private _no_records = 'No hay registros';
  private _errorMessage: any;
  private _voicemailstatus: boolean = false;

  private _extension: string = localStorage.getItem('mybcexten');


  constructor(private voicemailService: VoicemailService) { }

  ngOnInit() {
    console.log('iniciando voicemail');
    this.getVoicemailStatus();
    this.getVoicemailData();
  }

  getVoicemailStatus(){
    this.voicemailService.getVoicemailStatus(this._extension).subscribe(status => this.setStatus(status)),
                  error => this._errorMessage = <any> error;
  }

  private setStatus(status: boolean){
    console.log("Estado recibido:"+status);
    this._voicemailstatus = status;
  }

  private setStatusEvent(event){
    this.setVoicemailStatus(this._voicemailstatus);
  }

  setVoicemailStatus(status: boolean){
    console.log('estableciendo voicemail a:'+status + ', estado actual:'+this._voicemailstatus);
    var _result: boolean;
    this.voicemailService.setVoicemailStatus(this._extension, status).subscribe(result => this.validarStatus(result)),
                   error => this._errorMessage = <any> error;
  }

  validarStatus(result: boolean){
    if (result){
      this.getVoicemailStatus();
    }
  }

  getVoicemailData(){
    console.log('consultando voicemail:'+this._extension);
    this.voicemailService.getVoicemailData(this._extension).subscribe(voicemails => this._voicemails = voicemails),
                   error => this._errorMessage = <any> error;
  }

  downloadFile(url:string){
    this.voicemailService.downloadFile(url);
  }

}
