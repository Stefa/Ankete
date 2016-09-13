import {inject, fakeAsync, TestBed, tick} from "@angular/core/testing";
import {MockBackend, MockConnection} from "@angular/http/testing";
import { ApiService } from "./ApiService";
import {BaseRequestOptions, Http, ConnectionBackend, ResponseOptions, Response} from "@angular/http";

describe('ApiService', () => {
    const apiUrl = 'http://localhost:3210';

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                BaseRequestOptions,
                MockBackend,
                ApiService,
                {
                    provide: Http,
                    useFactory: (backend: ConnectionBackend, defaultOptions: BaseRequestOptions) => {
                        return new Http(backend, defaultOptions);
                    },
                    deps: [MockBackend, BaseRequestOptions]
                }
            ]
        });
    });
    it('gets data from api', inject([ApiService, MockBackend], fakeAsync((service: ApiService, backand: MockBackend) => {
        let getResponse: any = {};
        let getUrl = apiUrl+'/users/1';
        backand.connections.subscribe((connection: MockConnection) => {
            expect(connection.request.url).toBe(getUrl);
            let response: ResponseOptions = new ResponseOptions({body: '{"name":"Zaphod","type":"author"}'});
            connection.mockRespond(new Response(response));
        });
        service.get('users/1').subscribe((response) => {
            getResponse = response;
        });
        tick();
        expect(getResponse.name).toBe('Zaphod');
    })));

});
