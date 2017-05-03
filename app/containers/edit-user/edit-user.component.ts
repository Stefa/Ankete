import {Component, OnInit} from '@angular/core';
import {User} from "../../data/user.data";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../../services/user/user.service";

@Component({
    moduleId: module.id,
    selector: 'edit-user',
    templateUrl: 'edit-user.component.html'
})
export class EditUserComponent implements OnInit {
    user: User;
    constructor(
        private route: ActivatedRoute,
        private userService: UserService,
        private router: Router
    ) {}

    ngOnInit() {
        this.user = this.route.snapshot.data['user'];
    }

    onUserFormSubmit(userObject) {
        console.log(userObject);
        this.userService.updateUser(this.user.id, userObject).subscribe(
            createdUser => this.router.navigate(['/users'])
        );
    }

    onUserFormCancel() {
        this.router.navigate(['/users']);
    }
}
