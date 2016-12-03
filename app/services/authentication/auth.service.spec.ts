import {inject, fakeAsync, TestBed, tick} from "@angular/core/testing";
import {UserService} from "../user/user.service";
import {AuthService} from "./auth.service";
import {ApiService} from "../api/api.service";
import {HttpModule} from "@angular/http";
import {User} from "../../data/user.data";
import {Observable} from 'rxjs/Rx';
import { leonardoUserObject } from '../../test/users';

describe('AuthService', () => {
    let username = 'Leo';
    let password = 'turtlePower';

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

    afterEach(() => localStorage.clear());

    describe('login', () => {
        it('logs the user in when the credentials are correct', inject([UserService, AuthService], fakeAsync(
            (userService: UserService, authService: AuthService) => {
                let query = new Map(<[string,string][]>[['username', username], ['password', password]]);
                let loginSuccessful: boolean;

                spyOn(userService, 'getUsers').and.returnValue(Observable.of([leonardoUserObject]));
                spyOn(localStorage, 'setItem');
                authService.login(username, password).subscribe(
                    (res: boolean) => loginSuccessful = res
                );
                tick();

                expect(userService.getUsers).toHaveBeenCalledWith(query);
                expect(localStorage.setItem).toHaveBeenCalledWith("user", JSON.stringify(leonardoUserObject));
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
            spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(leonardoUserObject));
            loggedIn = authService.isLoggedIn();

            expect(localStorage.getItem).toHaveBeenCalledWith('user');
            expect(loggedIn).toBe(true);
        }));

        it('returns false if user is not logged in', inject([AuthService], (authService: AuthService) => {
            let loggedIn: boolean;
            spyOn(localStorage, 'getItem').and.returnValue(null);
            loggedIn = authService.isLoggedIn();

            expect(localStorage.getItem).toHaveBeenCalledWith('user');
            expect(loggedIn).toBe(false);
        }));
    });

    describe('getLoggedInUser', () => {
        it('returns the logged in user', inject([AuthService],(authService: AuthService) => {
            let loggedInUser: User;
            spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(leonardoUserObject));
            loggedInUser = authService.getLoggedInUser();

            expect(localStorage.getItem).toHaveBeenCalledWith('user');
            expect(loggedInUser).toEqual(leonardoUserObject);
        }));

        it('returns null user is not logged in', inject([AuthService],(authService: AuthService) => {
            let loggedInUser: User;
            spyOn(localStorage, 'getItem').and.returnValue(null);
            loggedInUser = authService.getLoggedInUser();

            expect(localStorage.getItem).toHaveBeenCalledWith('user');
            expect(loggedInUser).toEqual(null);
        }));
    });

    describe('logout', () => {
        it('logs the user out', inject([AuthService], (authService: AuthService) => {
            spyOn(localStorage, 'removeItem');
            authService.logout();

            expect(localStorage.removeItem).toHaveBeenCalledWith("user");
        }))
    });

    describe('getCurrentUser', () => {
        let currentUser: User;
        function watchCurrentUser(authService: AuthService) {
            authService.getCurrentUser().subscribe((user: User) => {
                currentUser = user;
            })
        }

        it('gets the update to the current user when someone logs in', inject(
            [AuthService, UserService],
            fakeAsync(
                (authService: AuthService, userService: UserService) => {
                    watchCurrentUser(authService);
                    expect(currentUser).toBe(null);
                    spyOn(userService, 'getUsers').and.returnValue(Observable.of([leonardoUserObject]));

                    authService.login(username, password).subscribe();
                    tick();
                    expect(currentUser).toEqual(leonardoUserObject);
                }
            )
        ));

        it('gets the update to the current user when someone logs out', inject(
            [AuthService, UserService],
            fakeAsync(
                (authService: AuthService, userService: UserService) => {
                    watchCurrentUser(authService);
                    spyOn(userService, 'getUsers').and.returnValue(Observable.of([leonardoUserObject]));

                    authService.login(username, password).subscribe();
                    tick();
                    expect(currentUser).toEqual(leonardoUserObject);

                    authService.logout();
                    tick();
                    expect(currentUser).toEqual(null);
                }
            )
        ));

    });
});
