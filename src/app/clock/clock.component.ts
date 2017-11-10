import { Component, OnInit, Input, Output, OnChanges, SimpleChange } from '@angular/core';
import {Subscription} from "rxjs";
import {TimerObservable} from "rxjs/observable/TimerObservable";

@Component({
  selector: 'app-clock',
  templateUrl: './clock.component.html',
  styleUrls: ['./clock.component.css']
})
export class ClockComponent implements OnInit, OnChanges {

  private _hour:number;
  private _minute:number;
  private _second:number;
  private _data;
  private _running:boolean = false;
  private _timer:any;
  private _sub:any;
  private _intervalSet = false;

  private tick: number;
  private subscription: Subscription;

  @Input() enabled: boolean = false;

  constructor() {

    this.createClock();

  }

  ngOnInit() {
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    console.log('Evento: Cambio en reloj');
    for (let propName in changes) {
      console.log('Evento: parametro reloj: ' + propName);
      if (propName = "enabled") {
        let changedProp = changes[propName];
        console.log('Evento: parametro valor reloj: '+ changedProp.currentValue);
        if (changedProp.currentValue === true) {
          this.start();
        } else {
          this.stop();
        }
      }
    }
  }

  private createClock() {
    console.log('Evento: Creando Reloj');
    this.reset();
  }

  private formatClock(){
    this._data = new Date(2000,1,1,this._hour,this._minute,this._second,0);
  }

  private reset() {
    this._hour = 0;
    this._minute = 0;
    this._second = 0;
    this.formatClock();
  }

  private start() {
    this.reset();
    console.log('Evento: Iniciando Reloj');
    this._timer = TimerObservable.create(0,1000);
        // subscribing to a observable returns a subscription object
    this._sub = this._timer.subscribe(t => this.tickerFunc(t)); 
    this._running = true;   
  }

  private stop(){
    console.log('Evento: ejecutando stop del reloj');
    if (this._running){
      this._sub.unsubscribe();
    }
  }

  private tickerFunc(t){
    this._second++;
    if (this._second > 59) {
      this._second = 0;
      this._minute++;
      if (this._minute > 59){
        this._minute = 0;
        this._hour++;
      }
    }
    this.formatClock();
  }

}
