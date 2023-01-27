import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

@Injectable() export class ActivityService {
    public url: string;
    private emit$ = new BehaviorSubject<boolean>(false);
    emitAgregarProducto$ = this.emit$.asObservable();
    
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

    onEmit() {
        this.emit$.next(true);
    }

}