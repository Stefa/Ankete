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
                expect(getError.message).toBe('Došlo je do greške na serveru.')
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

    describe('Patch action', () => {
        it('should send serialized object to the right api url with patch request', inject(
            [ApiService, MockBackend],
            fakeAsync((service: ApiService, backend: MockBackend) => {
                let questionSurveyIdUpdate: any = {
                    surveyId: 1
                };
                let updatedObject = Object.assign({id: 1}, questionSurveyIdUpdate);
                let patchUrl: string = apiUrl+'/questions/1';
                let requestBodyString = JSON.stringify(questionSurveyIdUpdate);

                backend.connections.subscribe((connection: MockConnection) => {
                    expect(connection.request.url).toBe(patchUrl);
                    expect(connection.request.method).toBe(RequestMethod.Patch);
                    expect(JSON.stringify(JSON.parse(connection.request.getBody()))).toEqual(requestBodyString);
                    let responseBody = `{
                        "surveyId": 1,
                        "id": 1 
                    }`;
                    let response: ResponseOptions = new ResponseOptions({body: responseBody});
                    connection.mockRespond(new Response(response));
                });


                let patchResponse: any = null;

                service.patch('questions/1', questionSurveyIdUpdate)
                    .subscribe(response => patchResponse = response);
                tick();
                expect(patchResponse).toEqual(updatedObject);
            })
        ));

        it('should handle http errors by returning the status code and message', inject(
            [ApiService, MockBackend],
            fakeAsync((service: ApiService, backend: MockBackend) => {
                let patchResponse = null;
                let patchError = null;
                mockConnectionError(backend, 404, 'Not Found');
                service.patch('tests/1', {title: 'New test'}).subscribe(
                    (response) => patchResponse = response,
                    (error) => patchError = error
                );
                tick();

                expect(patchResponse).toBeNull();
                expect(patchError.status).toBe(404);
                expect(patchError.message).toBe('404 - Not Found')
            })
        ));
    });

    describe('Put action', () => {
        it('should send serialized object to the right api url with put request', inject(
            [ApiService, MockBackend],
            fakeAsync((service: ApiService, backend: MockBackend) => {
                let answerSurveyIdUpdate: any = {
                    progressId: 1,
                    questionId: 2,
                    answers: 4
                };
                let updatedObject = Object.assign({id: 7}, answerSurveyIdUpdate);
                let putUrl: string = apiUrl+'/answers/7';
                let requestBodyString = JSON.stringify(answerSurveyIdUpdate);

                backend.connections.subscribe((connection: MockConnection) => {
                    expect(connection.request.url).toBe(putUrl);
                    expect(connection.request.method).toBe(RequestMethod.Put);
                    expect(JSON.stringify(JSON.parse(connection.request.getBody()))).toEqual(requestBodyString);
                    let responseBody = `{
                        "progressId": 1,
                        "questionId": 2,
                        "answers": 4,
                        "id": 7
                    }`;
                    let response: ResponseOptions = new ResponseOptions({body: responseBody});
                    connection.mockRespond(new Response(response));
                });


                let putResponse: any = null;

                service.put('answers/7', answerSurveyIdUpdate)
                    .subscribe(response => putResponse = response);
                tick();
                expect(putResponse).toEqual(updatedObject);
            })
        ));

        it('should handle http errors by returning the status code and message', inject(
            [ApiService, MockBackend],
            fakeAsync((service: ApiService, backend: MockBackend) => {
                let putResponse = null;
                let putError = null;
                mockConnectionError(backend, 404, 'Not Found');
                service.put('tests/8', {title: 'New test'}).subscribe(
                    (response) => putResponse = response,
                    (error) => putError = error
                );
                tick();

                expect(putResponse).toBeNull();
                expect(putError.status).toBe(404);
                expect(putError.message).toBe('404 - Not Found')
            })
        ));
    });
    
    describe('Delete action', () => {
        it('should send delete request to the api', inject(
            [ApiService, MockBackend],
            fakeAsync((service: ApiService, backend: MockBackend) => {
                let deleteUrl: string = apiUrl+'/answers/1';
                let deleteResponse;

                backend.connections.subscribe((connection: MockConnection) => {
                    expect(connection.request.url).toBe(deleteUrl);
                    expect(connection.request.method).toBe(RequestMethod.Delete);
                    let response: ResponseOptions = new ResponseOptions({body: '{}'});
                    connection.mockRespond(new Response(response));
                });

                service.delete('answers/1')
                    .subscribe(response => deleteResponse = response);
                tick();
                expect(deleteResponse).toEqual({});
            })
        ));

        it('should handle http errors by returning the status code and message', inject(
            [ApiService, MockBackend],
            fakeAsync((service: ApiService, backend: MockBackend) => {
                let deleteResponse = null;
                let deleteError = null;
                mockConnectionError(backend, 404, 'Not Found');
                service.delete('tests/1').subscribe(
                    (response) => deleteResponse = response,
                    (error) => deleteError = error
                );
                tick();

                expect(deleteResponse).toBeNull();
                expect(deleteError.status).toBe(404);
                expect(deleteError.message).toBe('404 - Not Found')
            })
        ));
    });
});
