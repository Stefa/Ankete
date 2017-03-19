import { Injectable }     from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router}    from '@angular/router';
import {AuthService} from "../../services/authentication/auth.service";
import {UserPermissions} from "../../data/user.data";

@Injectable()
export class ClerkGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if(!this.authService.isLoggedIn()) {
            this.router.navigate(['/login']);
            return false;
        }
        let user = this.authService.getLoggedInUser();
        let userPermission = UserPermissions[user.type];
        return userPermission >= UserPermissions.clerk
    }
}
