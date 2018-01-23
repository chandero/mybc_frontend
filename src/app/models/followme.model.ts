import { Injectable } from '@angular/core';
import { FollowmeData } from './followme_data.model';

import { Extension } from './extension.model';

@Injectable() 
export class Followme {
    public extlist: FollowmeData[] = new Array<FollowmeData>(5);
    public extension: Extension = new Extension(); 
    public sigu_id: number = -1;
    public sigu_extlist: String = "";
    public sigu_activo: boolean = false;

    constructor() { 
        for (var x = 0; x < 5; x++ ){
            var fd:FollowmeData = new FollowmeData();
            fd.extension = '';
            fd.tiempo = '15';
            this.extlist[x] = fd;
        };
    }

    public empaquetarLista(){
        var data:string = "";
        this.extlist.forEach((exten) => {
            if (exten.extension != "" && exten.extension != undefined ){
                if (exten.tiempo === "" || exten.tiempo === undefined ){
                    exten.tiempo = '15';
                }
                data += exten.extension+','+exten.tiempo+' ';
            }
        });
        data.slice(0, -1);
        this.sigu_extlist = data;
        this.extension.exte_numero = Number(localStorage.getItem('mybcexten'));
    }

    public procesarLista() {
        if (this.sigu_extlist != ''){
        var data = this.sigu_extlist.split(" ");
        var i=0;
        data.forEach((exten) => {
            var fdata = new FollowmeData();
            var gdata = exten.split(",");
            fdata.extension = gdata[0];
            fdata.tiempo = gdata[1];
            this.extlist[i] = fdata;
            i++;
            if (i>4){
                return;
            }
        });
        }
    }
}