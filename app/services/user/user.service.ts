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
        delete newUser.id;

        if(newUser.type !== userTypes.external && !newUser.hasOwnProperty('username')) {
            let errorMessage = 'Korisnik mora imati definisano korisničko ime.';
            return Observable.throw(errorMessage);
        }

        if(newUser.type !== userTypes.external && !newUser.hasOwnProperty('password')) {
            let errorMessage = 'Korisnik mora imati definisanu lozinku.';
            return Observable.throw(errorMessage);
        }

        if(newUser.type == userTypes.external) {
            delete newUser.username;
            delete newUser.password;
        }

        if(newUser.username != null) {
            let query = new Map(<[string,string][]>[['username', newUser.username]]);
            return this.getUsers(query).switchMap((users) => {
                if(users.length>0) {
                    return Observable.throw("Korisnik sa datim korisničkim imenom već postoji.")
                }

                let emailQuery = new Map(<[string, string][]>[['email', newUser.email]]);
                return this.getUsers(emailQuery).switchMap((users) => {
                    if(users.length>0) {
                        return Observable.throw("Korisnik sa datiom e-mail adresom već postoji.")
                    }

                    return this.api.post('users', newUser).map((res:any) => {
                        if(UserService.checkIfUserObject(res)) {
                            return UserService.createUserObjectFromResponse(res);
                        }

                        throw new Error('Bad api post response while creating new user.');
                    });
                });
            });
        } else {
            let emailQuery = new Map(<[string, string][]>[['email', newUser.email]]);
            return this.getUsers(emailQuery).switchMap((users) => {
                if(users.length>0) {
                    return Observable.throw("Korisnik sa datiom e-mail adresom već postoji.")
                }

                return this.api.post('users', newUser).map((res:any) => {
                    if(UserService.checkIfUserObject(res)) {
                        return UserService.createUserObjectFromResponse(res);
                    }

                    throw new Error('Bad api post response while creating new user.');
                });
            });
        }
    }
}
