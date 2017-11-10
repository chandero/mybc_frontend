import { Injectable } from '@angular/core';

import { Protocolo } from './protocolo.model';

@Injectable()
export class User {

	public exte_id: number;
	public protocolo: Protocolo;
	public exte_numero: string;
	public exte_clave: string;
	public exte_claveweb: string;
	public exte_descripcion: string;
	public exte_estado: boolean;
}