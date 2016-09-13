import { Component } from '@angular/core';
import { ApiService } from '../services/api/ApiService';

@Component({
    selector: 'my-app',
    template: '<h1>My First Angular 2 App</h1><br> {{userOut | json}}'
})
export class AppComponent {
    public userOut;

    constructor(public api:ApiService) {
        api.get('users/1').subscribe((response) => {
            this.userOut = response;
        });
    }
}
