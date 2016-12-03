import {Http, Response} from "@angular/http";
import { Observable } from 'rxjs/Rx';
import {Injectable} from "@angular/core";

@Injectable()
export class ApiService{
    static BASE_URL: string = 'http://localhost:3210/';

    constructor(public http: Http) {
    }

    get(path: string): Observable<Response> {
        let requestPath = ApiService.BASE_URL + path;
        let res: Observable<Response> = this.http.request(requestPath);
        return res.map((res: any) => res.json()).catch((error: any) => {
            let apiError: any = {};
            apiError.message = error.status ? `${error.status} - ${error.statusText}` : 'Server error';
            apiError.status = error.status;
            return Observable.throw(apiError);
        });
    }
}
