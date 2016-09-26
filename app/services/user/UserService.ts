import {Injectable} from "@angular/core";
import {ApiService} from "../api/ApiService";
import {User} from "../../data/User";

import {Observable} from 'rxjs/Rx';

@Injectable()
export class UserService {
    constructor(public api: ApiService) {

    }

    getUser(id: number): Observable<User> {
        return this.api.get('users/'+id).map((res:any) => {
            if(this.checkIfUserObject(res)) {
                return this.createUserObject(res);
            }

            throw new Error('User structure is not valid!');
        }).catch((error: any) => {
            let errorMessage: string = error.message;
            if(error.hasOwnProperty('status') && error.status === 404) {
                errorMessage = 'Requested user does not exist!'
            }
            if(errorMessage.startsWith('Error: ')) {
                errorMessage = errorMessage.substring(8);
            }
            return Observable.throw(errorMessage);
        });
    }

    private checkIfUserObject(user: any) {
        let requiredProperties = ['id', 'type', 'name', 'surname', 'email'];
        for (let property of requiredProperties) {
            if(!user.hasOwnProperty(property)) {
                return false;
            }
        }

        let allProperties = ['id', 'type', 'name', 'surname', 'username', 'password', 'birthday', 'phone', 'email'];
        for (let property in user) {
            if(!user.hasOwnProperty(property)) continue;
            if(allProperties.indexOf(property) === -1) {
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
