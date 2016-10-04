import {Injectable} from "@angular/core";
import {UserService} from "../user/UserService";
import {User} from "../../data/User";

@Injectable()
export class AuthService {
    constructor(public userService: UserService) {}

    login(username: string, password: string) {
        let user: User;
        let query = new Map(<[string,string][]>[['username', username], ['password', password]]);
        return this.userService.getUsers(query).map((res: User[]) => {
            if(res.length > 0){
                user = res[0];
                localStorage.setItem('user', JSON.stringify(user));
                return true;
            }
            return false;
        });
    }

    static isLoggedIn() {
        let user:User = AuthService.getLoggedInUser();
        return user !== null;
    }

    static getLoggedInUser() {
        let user:any = JSON.parse(localStorage.getItem('user'));
        if(user !== null && UserService.checkIfUserObject(user)) {
            return UserService.createUserObject(user);
        }
        return user;
    }
}
