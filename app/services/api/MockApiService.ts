export class MockApiService {
    get;
    private fakeResponse;

    constructor() {
        this.get = jasmine.createSpy('get').and.returnValue(this);
    }

    subscribe(callback) {
        callback(this.fakeResponse);
    }

    map(callback) {
        this.fakeResponse = callback(this.fakeResponse);
        return this;
    }

    setResponse(json: any): void {
        this.fakeResponse = json;
    }
}
