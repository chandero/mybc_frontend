import { Component, OnInit, Attribute } from '@angular/core';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})
export class StatusComponent implements OnInit {

  private _userFullname: string = "User Full Name";
  private _userPhone: string = "2020";

  private _data;
  private _format;
  private _timer = true;
  private _intervalSet = false;

  constructor( @Attribute("data") data) {

    var date, miliseconds;
    this._format = 'hh:mm:ss';
    this._data = data || new Date();
    if (this._timer) {
      if (this._data instanceof Date) {
        date = this._data;
      } else {
        date = new Date();
      }

      miliseconds = (60 - date.getSeconds()) * 1000;
      window.setTimeout(() => { this.refreshTime(); }, miliseconds);
    }

  }

  ngOnInit() {
  }

  refreshTime() {
    this._data = new Date();
    if (!this._intervalSet) {
      window.setInterval(() => { this.refreshTime() }, 60000);
      this._intervalSet = true;
    }
  }

}
