import {Observable} from 'rxjs/Rx';

export class MockApiService {
    get;
    post;
    patch;
    put;
    delete;
    private fakeObservable;

    init() {
        this.get = jasmine.createSpy('get').and.returnValue(this.fakeObservable);
        this.post = jasmine.createSpy('post').and.returnValue(this.fakeObservable);
        this.patch = jasmine.createSpy('patch').and.returnValue(this.fakeObservable);
        this.put = jasmine.createSpy('put').and.returnValue(this.fakeObservable);
        this.delete = jasmine.createSpy('delete').and.returnValue(this.fakeObservable);
    }

    setResponse(responseObject: any): void {
        this.fakeObservable = Observable.of(responseObject);
    }

    setError(error: any): void {
        this.fakeObservable = Observable.throw(error);
    }
}
