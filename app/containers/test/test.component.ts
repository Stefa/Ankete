import { Component, OnInit } from '@angular/core';
import {User, userTypes} from "../../data/user.data";
import {UserService} from "../../services/user/user.service";
import {Observable} from 'rxjs/Rx';


@Component({
    moduleId: module.id,
    selector: 'test',
    templateUrl: 'test.component.html',
    styleUrls: ['test.component.css']
})
export class TestComponent implements OnInit {
    constructor(private userService: UserService) { }

    ngOnInit() {



    }

    onUserCreated(user: User) {
        console.log('User has been created', user);
    }

    onUserCanceled() {
        console.log('User has been canceled');
    }
}
