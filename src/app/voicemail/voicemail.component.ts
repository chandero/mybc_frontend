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

  private _extension: string = localStorage.getItem('mybcexten');


  constructor(private voicemailService: VoicemailService) { }

  ngOnInit() {
    console.log('iniciando voicemail');
    this.getVoicemailData();
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
