import { Component, OnInit } from '@angular/core';
import {UserPermissions, User} from '../../data/User';
import { AuthService } from '../../services/authentication/AuthService';
import {Router} from "@angular/router";

@Component({
    moduleId: module.id,
    selector: 'top-bar',
    templateUrl: 'top-bar.component.html',
    styleUrls: ['top-bar.component.css']
})
export class TopBarComponent implements OnInit {
    private currentUser;
    private userPermissions;
    private currentUserPermission;

    constructor(private authService: AuthService, private router: Router) {
        this.userPermissions = UserPermissions;
    }

    ngOnInit() {
        this.authService.getCurrentUser().subscribe(
            (user: User) => {
                this.currentUser = user;
                this.currentUserPermission = user != null ?
                    this.userPermissions[user.type] :
                    0;
            }
        )
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
}