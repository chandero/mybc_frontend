import { Component, OnInit, AfterViewChecked, ViewChild, ContentChild, ElementRef, AfterContentInit } from '@angular/core';

import { VideoconferenceService } from '../services/videoconference.service';

@Component({
  selector: 'app-videoconference',
  templateUrl: './videoconference.component.html',
  styleUrls: ['./videoconference.component.css']
})

export class VideoconferenceComponent implements OnInit {

  @ViewChild('videoconference', { read: ElementRef }) videoconferenceEl: ElementRef;

  private _urlRoom: string;

  constructor(private _videoconferenceservice: VideoconferenceService) { 

  }

  ngOnInit() {
  }

  public start(){
        var videoconference = this.videoconferenceEl.nativeElement;
        this._urlRoom = this._videoconferenceservice.initConference(videoconference); 
  }

  public dispose(){
    this._videoconferenceservice.dispose();
    this._urlRoom = '';
  }


}
