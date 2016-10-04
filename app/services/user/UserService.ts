import {Injectable} from "@angular/core";
import {ApiService} from "../api/ApiService";
import {User} from "../../data/User";

import {Observable} from 'rxjs/Rx';

@Injectable()
export class UserService {
    static ALL_PROPERTIES = ['id', 'type', 'name', 'surname', 'username', 'password', 'birthday', 'phone', 'email'];
    static REQUIRED_PROPERTIES = ['id', 'type', 'name', 'surname', 'email'];

    constructor(public api: ApiService) {

    }

    getUser(id: number): Observable<User> {
        return this.api.get('users/'+id).map((res:any) => {
            if(UserService.checkIfUserObject(res)) {
                return UserService.createUserObject(res);
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

    static checkIfUserObject(user: any) {
        for (let property of UserService.REQUIRED_PROPERTIES) {
            if(!user.hasOwnProperty(property)) {
                return false;
            }
        }

        for (let property in user) {
            if(!user.hasOwnProperty(property)) continue;
            if(UserService.ALL_PROPERTIES.indexOf(property) === -1) {
                return false;
            }
        }
        return true;
    }

    static createUserObject(user: any):User {
        let birthday: string = user.birthday;
        user.birthday = new Date(birthday);
        return user;
    }

    getUsers(query: Map<string, string>): Observable<User[]> {
        let queryString: string = '';
        let badPropertyException = {
            property: ''
        };
        try {
            query.forEach(
                (value: string, property: string) => {
                    if (UserService.ALL_PROPERTIES.indexOf(property) === -1) {
                        badPropertyException.property = property;
                        throw badPropertyException;
                    }
                    queryString += property + '=' + value;
                }
            );
        } catch (error) {
            if(error == badPropertyException) {
                let errorMessage = 'Tried to query users by wrong field: '+badPropertyException.property+'!';
                return Observable.throw(errorMessage);
            }
        }

        return this.api.get('users?' + queryString).map((res:any) => {
            let users: User[] = [];
            for(let user of res) {
                if(UserService.checkIfUserObject(user)) {
                    users.push(UserService.createUserObject(user));
                }
            }
            return users;
        });
    }
}
