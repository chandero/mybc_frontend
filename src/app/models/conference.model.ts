import { Injectable, Optional } from '@angular/core';

import { Conference_invitado } from './conference_invitado.model';

@Injectable()
export class Conference {

    public copr_id: number;
    public exco_id: number;
    public copr_fecha: string;
    public copr_duracion: number;
    public copr_activa: boolean;
    public copr_descripcion: string;
    public invitados: Conference_invitado[];

    constructor(){

    }
}