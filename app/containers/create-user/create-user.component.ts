import { Component, OnInit } from '@angular/core';
import {UserService} from "../../services/user/user.service";
import {Router} from "@angular/router";

@Component({
    moduleId: module.id,
    selector: 'create-user',
    templateUrl: 'create-user.component.html'
})
export class CreateUserComponent implements OnInit {
    constructor(private userService: UserService, private router: Router) { }

    ngOnInit() { }

    onUserFormSubmit(userObject) {
        this.userService.createUser(userObject).subscribe();
    }

    onUserFormCancel() {
        // this.router.navigate(['/']);
    }
}
