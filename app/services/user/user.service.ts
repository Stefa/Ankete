import {Injectable} from "@angular/core";
import {ApiService} from "../api/api.service";
import {User, userTypes} from "../../data/user.data";

import {Observable} from 'rxjs/Rx';

@Injectable()
export class UserService {
    static ALL_PROPERTIES = ['id', 'type', 'name', 'surname', 'username', 'password', 'birthday', 'phone', 'email'];
    static REQUIRED_PROPERTIES = ['id', 'type', 'name', 'surname', 'email'];

    constructor(public api: ApiService) {}

    getUser(id: number): Observable<User> {
        return this.api.get('users/'+id).map((res:any) => {
            if(UserService.checkIfUserObject(res)) {
                return UserService.createUserObjectFromResponse(res);
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
        if(user == null) return false;

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

    static createUserObjectFromResponse(user: any):User {
        return Object.assign(
            {},
            user,
            {birthday: new Date(user.birthday)}
        );
    }

    getUsers(query: Map<string, string>): Observable<User[]> {
        let queryString: string = '';
        let badPropertyException = {
            property: ''
        };
        try {
            let queryArray = [];
            query.forEach(
                (value: string, property: string) => {
                    if (UserService.ALL_PROPERTIES.indexOf(property) === -1) {
                        badPropertyException.property = property;
                        throw badPropertyException;
                    }
                    queryArray.push(property + '=' + value);
                }
            );
            queryString = queryArray.join('&');
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
                    users.push(UserService.createUserObjectFromResponse(user));
                }
            }
            return users;
        });
    }

    createUser(user: User): Observable<User> {
        let newUser: User = Object.assign({}, user);

        let {valid, message} = this.validateUserProperties(user);
        if(!valid) return Observable.throw(message);

        this.unsetUselessPropertiesForNewUser(newUser);

        let createUser$ = this.api.post('users', newUser).map((res:any) => {
            if(UserService.checkIfUserObject(res)) {
                return UserService.createUserObjectFromResponse(res);
            }

            throw new Error('Bad api post response while creating new user.');
        });

        let createUserIfUniqueEmail$ = this.createUserIfUniqueEmail(user, createUser$);
        return this.createUserIfUniqueUsername(user, createUserIfUniqueEmail$);
    }

    private unsetUselessPropertiesForNewUser(newUser: User) {
        delete newUser.id;

        if (newUser.type == userTypes.external) {
            delete newUser.username;
            delete newUser.password;
        }
    }

    private isDuplicateUser(check$ :Observable<User[]>, error$:Observable<User>, continue$:Observable<User>): Observable<User> {
        return check$.switchMap(
            users => users.length>0 ? error$ : continue$
        );
    }

    private validateUserProperties(user: User): {valid: boolean, message: string} {
        let valid = {valid: true, message: ''};
        let invalid = {valid: false, message: ''};

        if(user.type == userTypes.external) return valid;

        if(!user.hasOwnProperty('username')) {
            invalid.message = 'Korisnik mora imati definisano korisničko ime.';
            return invalid;
        }

        if(!user.hasOwnProperty('password')) {
            invalid.message = 'Korisnik mora imati definisanu lozinku.';
            return invalid;
        }

        return valid;
    }

    private createUserIfUniqueEmail(user: User, createUser$:Observable<User>) :Observable<User>{
        let emailQuery = new Map(<[string, string][]>[['email', user.email]]);
        let checkEmail$ = this.getUsers(emailQuery);
        let emailError$ = Observable.throw("Korisnik sa datiom e-mail adresom već postoji.");

        return this.isDuplicateUser(checkEmail$, emailError$, createUser$);
    }

    private createUserIfUniqueUsername(user: User, createUser$:Observable<User>) :Observable<User>{
        let checkUsername$ = Observable.of([]);
        if(user.username != null) {
            let query = new Map(<[string, string][]>[['username', user.username]]);
            checkUsername$ = this.getUsers(query);
        }
        let usernameError$ = Observable.throw("Korisnik sa datim korisničkim imenom već postoji.");

        return this.isDuplicateUser(checkUsername$, usernameError$, createUser$);
    }
}
