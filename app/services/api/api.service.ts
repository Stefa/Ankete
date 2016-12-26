import {Http, Response} from "@angular/http";
import { Observable } from 'rxjs/Rx';
import {Injectable} from "@angular/core";

@Injectable()
export class ApiService{
    static BASE_URL: string = 'http://localhost:3210/';

    constructor(public http: Http) {
    }

    get(path: string): Observable<any> {
        let requestPath = this.createRequestUri(path);
        let res: Observable<Response> = this.http.request(requestPath);
        return res.map(this.handleJsonResponse).catch(this.handleErrorResponse);
    }

    post(path: string, body: any): Observable<any> {
        let requestPath = this.createRequestUri(path);
        let res: Observable<Response> = this.http.post(requestPath, JSON.stringify(body));
        return res.map(this.handleJsonResponse).catch(this.handleErrorResponse);
    }

    private createRequestUri(path: string) {
        return ApiService.BASE_URL + path;
    }

    private handleJsonResponse(res: any){
        return res.json();
    }

    private handleErrorResponse(error: any) {
        let apiError: any = {};
        apiError.message = error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        apiError.status = error.status;
        return Observable.throw(apiError);
    }
}
