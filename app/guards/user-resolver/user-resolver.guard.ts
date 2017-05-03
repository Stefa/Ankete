import {Injectable} from "@angular/core";
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs/Rx";
import {User} from "../../data/user.data";
import {UserService} from "../../services/user/user.service";

@Injectable()
export class UserResolverGuard implements Resolve<User> {
    constructor(private userService: UserService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<User> {
        let userId = route.params['userId'];
        return this.userService.getUser(userId)
            .catch(_ => Observable.of(null));
    }
}


