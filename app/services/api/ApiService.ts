import {Http, Response} from "@angular/http";
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {Injectable} from "@angular/core";

@Injectable()
export class ApiService{
    static BASE_URL: string = 'http://localhost:3210/';

    constructor(public http: Http) {
    }

    get(path: string) {
        let requestPath = ApiService.BASE_URL + path;
        let res: Observable<Response> = this.http.request(requestPath);
        return res.map((res: any) => res.json());

        // return this.http.request(ApiService.BASE_URL+path).map((res: any) => res.json());
    }
}
