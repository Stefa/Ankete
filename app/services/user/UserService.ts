import {Injectable} from "@angular/core";
import {ApiService} from "../api/ApiService";
import {User} from "../../data/User";

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class UserService {
    constructor(public api: ApiService) {

    }

    getUser(id: number): Observable<User> {
        return this.api.get('users/'+id).map((res:any) => {
            if(this.checkIfUserObject(res)) {
                return this.createUserObject(res);
            }

            return null;
        });
    }

    private checkIfUserObject(user: any) {
        let requiredProperties = ['id', 'type', 'name', 'surname', 'username', 'password', 'birthday', 'phone', 'email'];
        for (let property of requiredProperties) {
            if(!user.hasOwnProperty(property)) {
                return false;
            }
        }
        return true;
    }

    private createUserObject(user: any):User {
        let birthday: string = user.birthday;
        user.birthday = new Date(birthday);
        return user;
    }
}
