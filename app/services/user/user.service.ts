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

            throw new Error('Objekat korisnika nije validan.');
        }).catch((error: any) => {
            let errorMessage: string = error.message;
            if(error.hasOwnProperty('status') && error.status === 404) {
                errorMessage = 'Trašeni korisnik ne postoji.'
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
                let errorMessage = 'Pokušano pretraživanje korisnika po pogrešnom polju: '+badPropertyException.property+'.';
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

        this.unsetUselessPropertiesForNewUser(newUser);
        let createUser$ = this.api.post('users', newUser).map((res:any) => {
            if(UserService.checkIfUserObject(res)) {
                return UserService.createUserObjectFromResponse(res);
            }

            throw new Error('Dobijen je pogrešan odgovor sa servera pri kreiranju korisnika.');
        });

        let createUserIfUniqueEmail$ = this.createUserIfUniqueEmail(user, createUser$);
        return this.createUserIfUniqueUsername(user, createUserIfUniqueEmail$);
    }

    private unsetUselessPropertiesForNewUser(newUser: User) {
        delete newUser.id;
    }

    private isDuplicateUser(check$ :Observable<User[]>, error$:Observable<User>, continue$:Observable<User>): Observable<User> {
        return check$.switchMap(
            users => users.length>0 ? error$ : continue$
        );
    }

    private createUserIfUniqueEmail(user: User, createUser$:Observable<User>) :Observable<User>{
        let emailQuery = new Map<string, string>();
        emailQuery.set('email', user.email);
        let checkEmail$ = this.getUsers(emailQuery);
        let emailError$ = Observable.throw("Korisnik sa datiom e-mail adresom već postoji.");

        return this.isDuplicateUser(checkEmail$, emailError$, createUser$);
    }

    private createUserIfUniqueUsername(user: User, createUser$:Observable<User>) :Observable<User>{
        let usernameQuery = new Map<string, string>();
        usernameQuery.set('username', user.username);
        let checkUsername$ = this.getUsers(usernameQuery);
        let usernameError$ = Observable.throw("Korisnik sa datim korisničkim imenom već postoji.");

        return this.isDuplicateUser(checkUsername$, usernameError$, createUser$);
    }
}
