import { Injectable, Optional } from '@angular/core';

@Injectable()
export class Voicemail {

    public voic_id: string;
    public voic_file: string;    
    public voic_origin: string;
    public voic_date: string;
    public voic_duration: number;

    constructor(){}
}