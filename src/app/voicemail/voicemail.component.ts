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
    this.getVoicemailData();
    //this.getVoicemailStatus();
  }

  getVoicemailStatus(){
    this.voicemailService.getVoicemailStatus(this._extension).subscribe(status => this._voicemailstatus),
                  error => this._errorMessage = <any> error;
  }

  setVoicemailStatus(status: boolean){

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
