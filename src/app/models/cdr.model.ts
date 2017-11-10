import { Injectable, Optional } from '@angular/core';

@Injectable()
export class Cdr {
	public calldate: Date;
	public clid: string;
	public src: string;
	public dst: string;
	public dcontext: string;
	public channel: string ;
	public dstchannel: string;
	public lastapp: string;
	public lastdata: string;
	public duration: number;
	public billsec: number;
	public disposition: number;
	public amaflags: number;
	public accountcode: string;
	public uniqueid: string;
	public userfield: string;
	public sequence: number;
	public linkeid: string;
	public start: Date;
	public answer: Date;
	public end: Date;
	public incall: boolean;

    constructor(){}
    
}