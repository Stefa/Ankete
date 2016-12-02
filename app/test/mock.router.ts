import {Injectable} from "@angular/core";

@Injectable()
export class MockRouter {
    navigate: Function;
    constructor() {
        let navigationDone = new Promise(((resolve, reject) => {resolve(true);}));
        this.navigate = jasmine.createSpy('navigate').and.returnValue(navigationDone);
    }

}
