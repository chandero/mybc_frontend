import {Injectable} from "@angular/core";
import {GooglePeopleApi} from "./config/GooglePeopleApi";
import {HttpService} from "../common/http/HttpService";
import {GoogleUserService} from "./googleUser.service";
import {Observable} from "rxjs";
import {ListResponse} from "../contacts/_internal/ListResponse";
import {Headers} from "@angular/http";

@Injectable()
export class PeopleResource {
    private readonly ENDPOINT_URL: string = GooglePeopleApi.URL + '/people';
    private authHeader: Headers = new Headers();

    constructor(private httpService: HttpService,
                private userService: GoogleUserService) {
        this.authHeader.append('Authorization', 'Bearer ' + userService.getToken())
    }

    public findAll(): Observable<PeopleListResponse> {
        let url = `${this.ENDPOINT_URL}/me/connections?pageSize=2000&personFields=names%2CphoneNumbers`;
        return this.httpService.get(url, {headers: this.authHeader});
    }


    public findById(peopleId: string, id: string): Observable<People> {
        let url = `${this.ENDPOINT_URL}/${peopleId}`;
        return this.httpService.get(url , {headers: this.authHeader})
    }

    public create(peopleId: string, people: People): Observable<People> {
        let url = `${this.ENDPOINT_URL}/${peopleId}`;
        return this.httpService.post(url, people, {headers: this.authHeader})
    }

    public update(peopleId: string, people: People): Observable<People> {
        let url = `${this.ENDPOINT_URL}/${peopleId}`;
        return this.httpService.put(url + "/" + people.etag, people, {headers: this.authHeader})
    }

    public delete(peopleId: string, id: string): Observable<void> {
        let url = `${this.ENDPOINT_URL}/${peopleId}`;
        return this.httpService.get(url + "/" + id, {headers: this.authHeader})
    }
}

export interface PeopleListResponse extends ListResponse {
    connections: People[]
}

export interface People {
    resourceName: string;
    etag: string;
    names: [
        {
            metadata:any;
            displayName: string;
            familyName: string;
            givenName: string;
            middleName: string;
            displayNameLastFirst: string;
        }
    ];
    phoneNumbers: [
        {
            metadata: any;
            value: string;
            canonicalForm: string;
            type: string;
            formattedType: string;
        }
    ];

}