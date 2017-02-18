import {inject, fakeAsync, TestBed, tick} from "@angular/core/testing";
import {MockBackend, MockConnection} from "@angular/http/testing";
import { ApiService } from "./api.service";
import {BaseRequestOptions, Http, ConnectionBackend, ResponseOptions, Response, RequestMethod} from "@angular/http";
import {questionTypes} from "../../data/question.data";

describe('ApiService', () => {
    const apiUrl = 'http://localhost:3210';

    function mockConnectionError(backend: MockBackend, status: number, message: string) {
        backend.connections.subscribe((connection: MockConnection) => {
            let error: any = new Error();
            error.status = status;
            error.statusText = message;
            connection.mockError(error);
        });
    }

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

    describe('Get action', () => {

        it('should get object from the api',
            inject([ApiService, MockBackend], fakeAsync((service: ApiService, backand: MockBackend) => {
                let getResponse: any = {};
                let getUrl = apiUrl+'/users/1';
                backand.connections.subscribe((connection: MockConnection) => {
                    expect(connection.request.url).toBe(getUrl);
                    expect(connection.request.method).toBe(RequestMethod.Get);
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

        it('should get array of objects from the api', inject(
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

        it('should handle http errors by throwing status code and presentable message', inject(
            [ApiService, MockBackend],
            fakeAsync((service: ApiService, backend: MockBackend) => {
                let getResponse: any;
                let getError: any;
                mockConnectionError(backend, 404, 'Not Found');
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

        it('should handle errors when server is not responding by throwing presentable message', inject(
            [ApiService, MockBackend],
            fakeAsync((service: ApiService, backend: MockBackend) => {
                let getResponse: any;
                let getError: any;
                mockConnectionError(backend, 0, '');
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

    describe('Post action', () => {
        it('should send serialized object to the right api url with post request', inject(
            [ApiService, MockBackend],
            fakeAsync((service: ApiService, backend: MockBackend) => {
                let newObject: any = {
                    type: questionTypes.choose_one,
                    text: 'Continue the sequence: 0, 1, 1, 2, 3, 5, ?',
                    answers: ['7', '8', '9'],
                    correct: 1,
                    author: {
                        name: "Leonardo",
                        surname: "da Vinci"
                    }
                };
                let createdObject = Object.assign({id: 1}, newObject);
                let postUrl: string = apiUrl+'/questions';
                let requestBodyString = JSON.stringify(newObject);

                backend.connections.subscribe((connection: MockConnection) => {
                    expect(connection.request.url).toBe(postUrl);
                    expect(connection.request.method).toBe(RequestMethod.Post);
                    expect(JSON.stringify(JSON.parse(connection.request.getBody()))).toEqual(requestBodyString);
                    let responseBody = `{ 
                        "type": 4, 
                        "text": "Continue the sequence: 0, 1, 1, 2, 3, 5, ?", 
                        "answers": [ "7", "8", "9" ], 
                        "correct": 1, 
                        "author": {
                            "name": "Leonardo", 
                            "surname": "da Vinci"
                        }, 
                        "id": 1 
                    }`;
                    let response: ResponseOptions = new ResponseOptions({body: responseBody});
                    connection.mockRespond(new Response(response));
                });


                let postResponse: any;

                service.post('questions', newObject).subscribe((response) => {
                    postResponse = response;
                });
                tick();
                expect(postResponse).toEqual(createdObject);
            })
        ));

        it('should handle http errors by returning the status code and message', inject(
            [ApiService, MockBackend],
            fakeAsync((service: ApiService, backend: MockBackend) => {
                let postResponse: any;
                let postError: any;
                mockConnectionError(backend, 404, 'Not Found');
                service.post('tests', {title: 'New test'}).subscribe(
                    (response) => postResponse = response,
                    (error) => postError = error
                );
                tick();

                expect(postResponse).not.toBeDefined();
                expect(postError.status).toBe(404);
                expect(postError.message).toBe('404 - Not Found')
            })
        ));
    });


});
