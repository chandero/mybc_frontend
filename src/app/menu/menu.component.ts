import { Component, OnInit, ViewChild } from '@angular/core';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  private _open: boolean = true;

  constructor() {
    
   }

  ngOnInit() {
  }

  private _toggleSidebar() { 
    this._open = !this._open;
  }

}
