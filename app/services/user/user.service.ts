import {Injectable} from "@angular/core";
import {ApiService} from "../api/api.service";
import {User, userTypes} from "../../data/user.data";

import {Observable} from 'rxjs/Rx';
import {UserDataValidator} from "../../data-validators/user/user.data-validator";

@Injectable()
export class UserService {
    constructor(public api: ApiService) {}

    getUser(id: number): Observable<User> {
        return this.api.get('users/'+id).map((res:any) => {
            let userValidator = new UserDataValidator(res);
            if(userValidator.checkIfUserApiResponseIsValid()) {
                return UserService.createUserObjectFromResponse(res);
            }

            throw new Error('Objekat korisnika nije validan.');
        }).catch((error: any) => {
            let errorMessage: string = error.message;
            if(error.hasOwnProperty('status') && error.status === 404) {
                errorMessage = 'Traženi korisnik ne postoji.'
            }
            if(errorMessage.startsWith('Error: ')) {
                errorMessage = errorMessage.substring(8);
            }
            return Observable.throw(new Error(errorMessage));
        });
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
                    if (UserDataValidator.isValidUserProperty(property)) {
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
                return Observable.throw(new Error(errorMessage));
            }
        }

        return this.api.get('users?' + queryString).map((res:any) => {
            let users: User[] = [];
            for(let user of res) {
                let userValidator = new UserDataValidator(user);
                if(userValidator.checkIfUserApiResponseIsValid()) {
                    users.push(UserService.createUserObjectFromResponse(user));
                }
            }
            return users;
        });
    }

    createUser(user: User): Observable<User> {
        let newUser: User = Object.assign({}, user);
        let userValidator = new UserDataValidator(user);
        if(!userValidator.checkIfUserObjectHasRequiredFields()) {
            return Observable.throw(new Error("Korisnik nema definisana sva obavezna polja."));
        }

        this.unsetUselessPropertiesForNewUser(newUser);
        return this.createUserIfUnique(newUser);
    }

    private unsetUselessPropertiesForNewUser(newUser: User) {
        delete newUser.id;
    }

    private createUserIfUnique(user):Observable<User> {
        let createUser$ = this.api.post('users', user).map((res:any) => {
            let userValidator = new UserDataValidator(res);
            if(userValidator.checkIfUserApiResponseIsValid()) {
                return UserService.createUserObjectFromResponse(res);
            }

            throw new Error('Dobijen je pogrešan odgovor sa servera pri kreiranju korisnika.');
        });

        let createUserIfUniqueEmail$ = this.continueIfUniqueEmail(user, createUser$);
        return this.continueIfUniqueUsername(user, createUserIfUniqueEmail$);
    }

    private continueIfUniqueEmail(user: User, continue$:Observable<User>) :Observable<User>{
        let emailQuery = new Map<string, string>();
        emailQuery.set('email', user.email);
        let checkEmail$ = this.getUsers(emailQuery);
        let emailError$ = Observable.throw(new Error("Korisnik sa datiom e-mail adresom već postoji."));

        return this.continueIfNoUsers(checkEmail$, emailError$, continue$);
    }

    private continueIfUniqueUsername(user: User, continue$:Observable<User>) :Observable<User>{
        let usernameQuery = new Map<string, string>();
        usernameQuery.set('username', user.username);
        let checkUsername$ = this.getUsers(usernameQuery);
        let usernameError$ = Observable.throw(new Error("Korisnik sa datim korisničkim imenom već postoji."));

        return this.continueIfNoUsers(checkUsername$, usernameError$, continue$);
    }

    private continueIfNoUsers(check$ :Observable<User[]>, error$:Observable<User>, continue$:Observable<User>): Observable<User> {
        return check$.switchMap(
            users => users.length>0 ? error$ : continue$
        );
    }

    deleteUser(userId: number): Observable<boolean> {
        return this.api
            .delete('users/'+userId)
            .map(_ => true)
            .catch(error => Observable.of(false));
    }
}
