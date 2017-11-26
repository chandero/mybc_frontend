import { Component, OnInit, AfterViewChecked, ViewChild, ContentChild, ElementRef, AfterContentInit, AfterViewInit, ViewContainerRef } from '@angular/core';

import { VideoconferenceService } from '../services/videoconference.service';

declare var Clipboard: any;

@Component({
  selector: 'app-videoconference',
  templateUrl: './videoconference.component.html',
  styleUrls: ['./videoconference.component.css']
})

export class VideoconferenceComponent implements OnInit, AfterViewInit {

  @ViewChild('videoconference', { read: ElementRef }) videoconferenceEl: ElementRef;

  private _urlRoom: string;
  private _inMeet: boolean = false;
  private _twitterUrl = "https://twitter.com/home?status=";
  private _facebookUrl = "https://www.facebook.com/sharer/sharer.php?u=";
  private _googleUrl = "https://plus.google.com/share?url=";
  private _linkedUrl = "https://www.linkedin.com/shareArticle?mini=true&url=";
  private _linkedUrlLast = "&title=&summary=&source=";
  
  private _clipboard:any;
  
  constructor(private _videoconferenceservice: VideoconferenceService){}

  ngAfterViewInit() {
    this._clipboard = new Clipboard('.mdl-button');
  }
 
  ngOnInit() {
  }

  public start(){
        var videoconference = this.videoconferenceEl.nativeElement;
        this._urlRoom = this._videoconferenceservice.initConference(videoconference);
        this._twitterUrl += encodeURI(this._urlRoom);
        this._facebookUrl += encodeURI(this._urlRoom);
        this._linkedUrl += encodeURI(this._urlRoom)+this._linkedUrlLast;
        this._googleUrl += encodeURI(this._urlRoom);
        this._inMeet = true;
  }

  public dispose(){
    this._videoconferenceservice.dispose();
    this._urlRoom = '';
    this._inMeet = false;
  }

}
