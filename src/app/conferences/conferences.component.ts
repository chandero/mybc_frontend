import { Component, OnInit } from '@angular/core';
import { Conference } from '../models/conference.model';
import { Contact } from '../models/contact.model';

@Component({
  selector: 'app-conferences',
  templateUrl: './conferences.component.html',
  styleUrls: ['./conferences.component.css']
})
export class ConferencesComponent implements OnInit {

  private _no_records = 'No hay registros';

  private _conferences = {};

  constructor() { }

  ngOnInit() {
  }

}
