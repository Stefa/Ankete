import {inject, fakeAsync, TestBed, tick} from "@angular/core/testing";
import {UserService} from "../user/UserService";
import {AuthService} from "./AuthService";
import {ApiService} from "../api/ApiService";
import {HttpModule} from "@angular/http";
import {User} from "../../data/User";
import {Observable} from 'rxjs/Rx';

describe('AuthService', () => {
    let username = 'Leo';
    let password = 'turtlePower';
    let user: User = {
        name: "Leonardo",
        surname: "da Vinci",
        type: "administrator",
        username: username,
        password: password,
        birthday: new Date("1452-04-15T16:00:00.000Z"),
        phone: "161803398",
        email: "gmail@leo.com",
        id: 1
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                UserService,
                AuthService,
                ApiService
            ],
            imports: [HttpModule]
        })
    });

    describe('login', () => {
        it('logs the user in when the credentials are correct', inject([UserService, AuthService], fakeAsync(
            (userService: UserService, authService: AuthService) => {
                let query = new Map(<[string,string][]>[['username', username], ['password', password]]);
                let loginSuccessful: boolean;

                spyOn(userService, 'getUsers').and.returnValue(Observable.of([user]));
                spyOn(localStorage, 'setItem');
                authService.login(username, password).subscribe(
                    (res: boolean) => loginSuccessful = res
                );
                tick();

                expect(userService.getUsers).toHaveBeenCalledWith(query);
                expect(localStorage.setItem).toHaveBeenCalledWith("user", JSON.stringify(user));
                expect(loginSuccessful).toBe(true);
            }
        )));

        it('does not login the user when the credentials are not correct', inject([UserService, AuthService], fakeAsync(
            (userService: UserService, authService: AuthService) => {
                let username = 'Leo';
                let password = 'rewopEltrut';
                let query = new Map(<[string,string][]>[['username', username], ['password', password]]);
                let loginSuccessful: boolean;

                spyOn(userService, 'getUsers').and.returnValue(Observable.of([]));
                spyOn(localStorage, 'setItem');
                authService.login(username, password).subscribe(
                    (res: boolean) => loginSuccessful = res
                );
                tick();

                expect(userService.getUsers).toHaveBeenCalledWith(query);
                expect(localStorage.setItem).not.toHaveBeenCalled();
                expect(loginSuccessful).toBe(false);
            }
        )));
    });

    describe('isLoggedIn', () => {
        it('returns true if user is logged in', inject([AuthService], (authService: AuthService) => {
            let loggedIn: boolean;
            spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(user));
            loggedIn = AuthService.isLoggedIn();

            expect(localStorage.getItem).toHaveBeenCalledWith('user');
            expect(loggedIn).toBe(true);
        }));

        it('returns false if user is not logged in', inject([AuthService], (authService: AuthService) => {
            let loggedIn: boolean;
            spyOn(localStorage, 'getItem').and.returnValue(null);
            loggedIn = AuthService.isLoggedIn();

            expect(localStorage.getItem).toHaveBeenCalledWith('user');
            expect(loggedIn).toBe(false);
        }));
    });

    describe('getLoggedInUser', () => {
        it('returns the logged in user', inject([AuthService],(authService: AuthService) => {
            let loggedInUser: User;
            spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(user));
            loggedInUser = AuthService.getLoggedInUser();

            expect(localStorage.getItem).toHaveBeenCalledWith('user');
            expect(loggedInUser).toEqual(user);
        }));

        it('returns null user is not logged in', inject([AuthService],(authService: AuthService) => {
            let loggedInUser: User;
            spyOn(localStorage, 'getItem').and.returnValue(null);
            loggedInUser = AuthService.getLoggedInUser();

            expect(localStorage.getItem).toHaveBeenCalledWith('user');
            expect(loggedInUser).toEqual(null);
        }));
    });
});
