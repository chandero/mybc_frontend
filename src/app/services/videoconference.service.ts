import { Injectable} from '@angular/core';
import { WindowRefService } from '../services/windowref.service';

declare var JitsiMeetExternalAPI: any;

@Injectable()
export class VideoconferenceService {

    private _domain:string;
    private _room = "room" + localStorage.getItem("mybcexten");
    private _width = "100%";
    private _heigth = 720;
    private _place = "videoconference";
    private _api: any;
    private _window: Window; 

    constructor(windowRef: WindowRefService) {
            this._window = windowRef.nativeWindow;
            this._domain = `${this._window.location.hostname}`+'/mybc/meet/';
    }
    public initConference(place: any): string {
            var configOverwrite = {enableWelcomePage : false};
            var interfaceConfigOverwrite = {filmStripOnly: false};
            this._api = new JitsiMeetExternalAPI(this._domain, this._room, this._width, this._heigth, place, configOverwrite, interfaceConfigOverwrite); 
            return `${this._window.location.protocol}`+'//'+this._domain + this._room;
    }

    public dispose(){
        this._api.dispose();
    }

}