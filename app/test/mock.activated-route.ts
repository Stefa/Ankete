import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import {Injectable} from "@angular/core";

@Injectable()
export class MockActivatedRoute {
    // ActivatedRoute.params observable
    private paramsSubject = new BehaviorSubject(this.testParams);
    params = this.paramsSubject.asObservable();

    private dataSubject = new BehaviorSubject(this.testData);
    data = this.dataSubject.asObservable();

    // Test parameters
    private _testParams: {};
    get testParams() { return this._testParams }
    set testParams(params: {}) {
        this._testParams = params;
        this.paramsSubject.next(params);
    }

    // Test data
    private _testData: {};
    get testData() { return this._testData; }
    set testData(data: {}) {
        this._testData = data;
        this.dataSubject.next(data);
    }

    // ActivatedRoute.snapshot.params
    get snapshot() {
        return {
            params: this.testParams ,
            data: this.testData
        };
    }
}