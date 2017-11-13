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
  private _twitterUrl = "https://twitter.com/home?status=";
  private _facebookUrl = "https://www.facebook.com/sharer/sharer.php?u=";
  private _googleUrl = "https://plus.google.com/share?url=";
  private _linkedUrl = "https://www.linkedin.com/shareArticle?mini=true&url=";

  constructor(private _videoconferenceservice: VideoconferenceService) { 

  }

  ngOnInit() {
  }

  public start(){
        var videoconference = this.videoconferenceEl.nativeElement;
        this._urlRoom = this._videoconferenceservice.initConference(videoconference);
        this._twitterUrl += encodeURI(this._urlRoom);
        this._facebookUrl += encodeURI(this._urlRoom);
        this._linkedUrl += encodeURI(this._urlRoom);
        this._googleUrl += encodeURI(this._urlRoom);
  }

  public dispose(){
    this._videoconferenceservice.dispose();
    this._urlRoom = '';
  }


}
