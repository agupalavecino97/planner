import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs';

@Injectable() export class ActivityService {
    public url: string;
    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    }
    constructor( private _http: HttpClient) {
        this.url = environment.url;;
    }


    getActivities() {
        return this._http.get(this.url + 'activities', this.httpOptions)
        .pipe(map((response: any) => response.data));
    }

}