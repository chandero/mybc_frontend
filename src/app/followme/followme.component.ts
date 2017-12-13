import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-followme',
  templateUrl: './followme.component.html',
  styleUrls: ['./followme.component.css']
})
export class FollowmeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  validateKey(event: KeyboardEvent){
    console.log("event:"+event.key);
    switch(event.key){
      case '0':
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
      case '+':
          break;
      default:
          event.preventDefault();
    }
  }

}
