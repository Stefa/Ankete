import { Component, OnInit } from '@angular/core';
import {User, userTypes} from "../../data/user.data";
import {UserService} from "../../services/user/user.service";

@Component({
    moduleId: module.id,
    selector: 'test',
    templateUrl: 'test.component.html',
    styleUrls: ['test.component.css']
})
export class TestComponent implements OnInit {
    constructor(private userService: UserService) { }

    ngOnInit() {
        console.log('test');
        let user: User = {
            name: "Leonardo",
            surname: "da Vinci",
            type: userTypes.administrator,
            // username: "Leo",
            username: "Leo1",
            password: "turtlePower",
            birthday: new Date("1452-04-15T16:00:00.000Z"),
            phone: "161803398",
            email: "gmail@leo.com",
            id: 1
        };
        let externalUser: User = {
            id: 3,
            name: "External",
            surname: "User",
            type: userTypes.external,
            birthday: new Date("1919-04-15T22:00:00.000Z"),
            phone: "1234567",
            email: "fake1@random.com",
            username: "Leon",
            password: "turtlePower1",
        };
        this.userService.createUser(user).subscribe(
            createdUser => console.log('CREATED USER: ',createdUser),
            error => console.log('ERROR: ', error)
        );

    }

}
