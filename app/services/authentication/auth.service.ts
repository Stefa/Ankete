import {Injectable} from "@angular/core";
import {UserService} from "../user/user.service";
import {User} from "../../data/user.data";
import {Observable} from "rxjs";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class AuthService {
    public currentUser: Observable<User>;
    private currentUserSubject: BehaviorSubject<User>;

    constructor(public userService: UserService) {
        this.currentUserSubject = new BehaviorSubject(this.getLoggedInUser());
        this.currentUser = this.currentUserSubject.asObservable();
    }

    login(username: string, password: string) {
        let user: User;
        let query = new Map(<[string,string][]>[['username', username], ['password', password]]);
        return this.userService.getUsers(query).map((res: User[]) => {
            if(res.length > 0){
                user = res[0];
                localStorage.setItem('user', JSON.stringify(user));
                this.updateCurrentUser();
                return true;
            }
            return false;
        });
    }

    isLoggedIn() {
        let user:User = this.getLoggedInUser();
        return user !== null;
    }

    getLoggedInUser() {
        let user:any = JSON.parse(localStorage.getItem('user'));
        if(user !== null && UserService.checkIfUserObject(user)) {
            return UserService.createUserObject(user);
        }
        return user;
    }

    getCurrentUser() {
        return this.currentUser;
    }

    logout() {
        localStorage.removeItem('user');
        this.updateCurrentUser();
    }

    private updateCurrentUser() {
        this.currentUserSubject.next(this.getLoggedInUser());
    }
}
