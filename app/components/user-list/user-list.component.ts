import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {User} from "../../data/user.data";
import {AuthService} from "../../services/authentication/auth.service";
import {UserService} from "../../services/user/user.service";

@Component({
    moduleId: module.id,
    selector: 'user-list',
    templateUrl: 'user-list.component.html',
    styleUrls: ['user-list.component.css']
})
export class UserListComponent implements OnInit, AfterViewInit {
    users: User[];

    constructor(
        private route: ActivatedRoute,
        private authService: AuthService,
        private userService: UserService,
        private router: Router
    ) {}

    ngOnInit() {
        this.users = this.route.snapshot.data['users'];
        this.removeMeUser();
    }

    ngAfterViewInit() {
        jQuery('.buttons .button').popup();
    }

    private removeMeUser() {
        let me = this.authService.getLoggedInUser();
        this.removeUserWithId(me.id);
    }

    private removeUserWithId(userId) {
        this.users = this.users.filter(user => user.id != userId);
    }

    public deleteUser(userId) {
        this.userService.deleteUser(userId).subscribe(
            userDeleted => this.removeUserWithId(userId)
        );
    }

    public goToEditUser(userId) {
        this.router.navigate(['edit-user', userId]);
    }
}
