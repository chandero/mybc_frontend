import { Injectable, Optional } from '@angular/core';

@Injectable()
export class Contact {
    public cont_name:string;
    public cont_number:string;
    public cont_incall:boolean;


    constructor(){}

}