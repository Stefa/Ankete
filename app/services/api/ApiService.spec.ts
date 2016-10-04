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

    function mockConnectionError(backend: MockBackend, expectedUrl: string, status: number, message: string) {
        backend.connections.subscribe((connection: MockConnection) => {
            expect(connection.request.url).toBe(expectedUrl);
            let error: any = new Error();
            error.status = status;
            error.statusText = message;
            connection.mockError(error);
        });
    }

    it('gets object from the api',
        inject([ApiService, MockBackend], fakeAsync((service: ApiService, backand: MockBackend) => {
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
        }))
    );

    it('gets array of objects from the api', inject(
        [ApiService, MockBackend],
        fakeAsync((service: ApiService, backand: MockBackend) => {
            let getResponse: any = {};
            let getUrl = apiUrl+'/users';
            backand.connections.subscribe((connection: MockConnection) => {
                expect(connection.request.url).toBe(getUrl);
                let response: ResponseOptions = new ResponseOptions({
                    body: '[{"name":"Zaphod","type":"author"},{"name":"Marvin","type":"admin"}]'
                });
                connection.mockRespond(new Response(response));
            });
            service.get('users').subscribe((response) => {
                getResponse = response;
            });
            tick();
            expect(getResponse[0].name).toBe('Zaphod');
            expect(getResponse[1].type).toBe('admin');
        })
    ));

    it('handles http errors by throwing status code and presentable message', inject(
        [ApiService, MockBackend],
        fakeAsync((service: ApiService, backend: MockBackend) => {
            let getUrl = apiUrl+'/users/0';
            let getResponse: any;
            let getError: any;
            mockConnectionError(backend, getUrl, 404, 'Not Found');
            service.get('users/0').subscribe(
                (response) => getResponse = response,
                (error) => getError = error
            );
            tick();

            expect(getResponse).not.toBeDefined();
            expect(getError.status).toBe(404);
            expect(getError.message).toBe('404 - Not Found')
        })
    ));

    it('handles errors when server is not responding by throwing presentable message', inject(
        [ApiService, MockBackend],
        fakeAsync((service: ApiService, backend: MockBackend) => {
            let getUrl = apiUrl+'/users/0';
            let getResponse: any;
            let getError: any;
            mockConnectionError(backend, getUrl, 0, '');
            service.get('users/0').subscribe(
                (response) => getResponse = response,
                (error) => getError = error
            );
            tick();

            expect(getResponse).not.toBeDefined();
            expect(getError.status).toBe(0);
            expect(getError.message).toBe('Server error')
        })
    ));

});
