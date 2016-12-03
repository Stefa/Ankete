import {Observable} from 'rxjs/Rx';

export class MockApiService {
    get;
    private fakeObservable;

    init() {
        this.get = jasmine.createSpy('get').and.returnValue(this.fakeObservable);
    }

    setResponse(json: any): void {
        this.fakeObservable = Observable.of(json);
    }

    setError(error: any): void {
        this.fakeObservable = Observable.throw(error);
    }
}
