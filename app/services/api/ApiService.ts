import {Http, Request, Response} from "@angular/http";
import { Observable } from 'rxjs/Rx';

export class ApiService{
    constructor(public http: Http) {
    }

    get(path: string) {
        let res: Observable<Response> = this.http.request(path);
        return res.map((res: any) => res.json());
    }
}
