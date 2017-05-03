import {fakeAsync, inject, tick, TestBed} from "@angular/core/testing";
import {Observable} from 'rxjs/Rx';

import {ApiService} from "../api/api.service";
import {MockApiService} from "../api/mock-api.service";
import { UserService } from './user.service';
import {User} from "../../data/user.data";

import {
leonardoUserObject, leonardoUserResponse, fibonacciUserResponse, fibonacciUserObject
} from '../../test/users';

describe('UserService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                UserService,
                {
                    provide: ApiService,
                    useClass: MockApiService
                }
            ]
        });
    });

    describe('getUser', () => {
        it('should get a user from the api', inject([ApiService, UserService], fakeAsync(
            (apiService: MockApiService, userService: UserService) => {
                let userId = 1;
                let user: User;
                apiService.setResponse(leonardoUserResponse);
                apiService.init();
                userService.getUser(userId).subscribe((res: User) => user = res);
                tick();
                expect(apiService.get).toHaveBeenCalledWith('users/1');
                expect(user).toEqual(leonardoUserObject);
            }
        )));

        it('should throw error when user does not have any of required properties', inject(
            [ApiService, UserService],
            fakeAsync(
                (apiService: MockApiService, userService: UserService) => {
                    let userId = 1;

                    let userResponse = Object.assign({}, leonardoUserResponse);
                    // delete the surname
                    delete userResponse.surname;

                    let user: User;
                    let errorMessage: any;

                    apiService.setResponse(userResponse);
                    apiService.init();

                    userService.getUser(userId).subscribe(
                        (res: User) => user = res,
                        (error: any) => errorMessage = error.message
                    );
                    tick();
                    expect(user).not.toBeDefined();
                    expect(errorMessage).toBe('Objekat korisnika nije validan.');
                }
            )
        ));

        it('should throw error when user has an invalid property', inject(
            [ApiService, UserService],
            fakeAsync(
                (apiService: MockApiService, userService: UserService) => {
                    let userId = 1;
                    let userResponse = Object.assign({weapon_of_choice: 'Katana'}, leonardoUserResponse);

                    let user: any;
                    let errorMessage: any;

                    apiService.setResponse(userResponse);
                    apiService.init();

                    userService.getUser(userId).subscribe(
                        (res: User) => user = res,
                        (error: any) => errorMessage = error.message
                    );
                    tick();
                    expect(user).not.toBeDefined();
                    expect(errorMessage).toBe('Objekat korisnika nije validan.');
                }
            )
        ));

        it('should throw error when user is not found', inject(
            [ApiService, UserService],
            fakeAsync(
                (apiService: MockApiService, userService: UserService) => {
                    let userId = 0;

                    let user: any;
                    let errorMessage: any;

                    let errorResponse: any = {
                        status: 404,
                        message: '404 - Not Found'
                    };

                    apiService.setError(errorResponse);
                    apiService.init();

                    userService.getUser(userId).subscribe(
                        (res: User) => user = res,
                        (error: any) => errorMessage = error.message
                    );
                    tick();
                    expect(user).not.toBeDefined();
                    expect(errorMessage).toBe('Traženi korisnik ne postoji.');
                }
            )
        ));
    });

    describe('getUsers', () => {
        it('should get the users by specified property', inject(
            [ApiService, UserService],
            fakeAsync(
                (apiService: MockApiService, userService: UserService) => {
                    let user1: User, user2: User;
                    let query: Map<string, string> = new Map(<[string,string][]>[['name', 'Leonardo']]);
                    apiService.setResponse([leonardoUserResponse, fibonacciUserResponse]);
                    apiService.init();
                    userService.getUsers(query).subscribe((res: User[]) => [user1, user2] = res);
                    tick();

                    expect(apiService.get).toHaveBeenCalledWith('users?name=Leonardo');
                    expect(user1).toEqual(leonardoUserObject);
                    expect(user2).toEqual(fibonacciUserObject);
                }
            )
        ));

        it('should get the users by specified properties', inject(
            [ApiService, UserService],
            fakeAsync(
                (apiService: MockApiService, userService: UserService) => {
                    let user1: User, user2: User;
                    let query: Map<string, string> = new Map(<[string,string][]>[['name', 'Leonardo'], ['type', 'administrator']]);
                    apiService.setResponse([leonardoUserResponse, fibonacciUserResponse]);
                    apiService.init();
                    userService.getUsers(query).subscribe((res: User[]) => [user1, user2] = res);
                    tick();

                    expect(apiService.get).toHaveBeenCalledWith('users?name=Leonardo&type=administrator');
                    expect(user1).toEqual(leonardoUserObject);
                    expect(user2).toEqual(fibonacciUserObject);
                }
            )
        ));

        it('should throw an error if the query parameter has invalid user property', inject(
            [ApiService, UserService],
            fakeAsync(
                (apiService: MockApiService, userService: UserService) => {
                    let query: Map<string, string> = new Map(<[string,string][]>[['age', '40']]);
                    let user: User;
                    let errorMessage: string;

                    apiService.setResponse([null]);
                    apiService.init();
                    userService.getUsers(query).subscribe(
                        (res: User[]) => user = res[0],
                        (error: any) => errorMessage = error.message
                    );
                    tick();

                    expect(apiService.get).not.toHaveBeenCalled();
                    expect(user).not.toBeDefined();
                    expect(errorMessage).toBe('Pokušano pretraživanje korisnika po pogrešnom polju: age.');
                }
            )
        ));
    });

    describe('createUser', () => {
        it('should send the post request to the api if user data is correct',
            inject([ApiService, UserService], fakeAsync((apiService: MockApiService, userService: UserService) => {
                let newUser: User = Object.assign({}, leonardoUserObject);
                delete newUser.id;

                spyOn(userService, 'getUsers').and.returnValue(Observable.of([]));
                apiService.setResponse(leonardoUserResponse);
                apiService.init();
                userService.createUser(newUser).subscribe(
                    user => {},
                    error => {}
                );
                tick();
                expect(apiService.post).toHaveBeenCalledWith('users', newUser);
            }))
        );

        it('should send the user object without id property to the api',
            inject([ApiService, UserService], fakeAsync((apiService: MockApiService, userService: UserService) => {
                let newUser: User = Object.assign({}, leonardoUserObject);
                let expectedRequestUser: User = Object.assign({}, newUser);
                delete expectedRequestUser.id;

                spyOn(userService, 'getUsers').and.returnValue(Observable.of([]));
                apiService.setResponse(leonardoUserResponse);
                apiService.init();
                userService.createUser(newUser).subscribe(
                    user => {},
                    error => {}
                );
                tick();
                expect(apiService.post).toHaveBeenCalledWith('users', expectedRequestUser);
            }))
        );

        it('should return Observable of User object when api returns created user',
            inject([ApiService, UserService], fakeAsync((apiService: MockApiService, userService: UserService) => {
                let newUser: User = Object.assign({}, leonardoUserObject);
                delete newUser.id;
                let createdUser: User;

                spyOn(userService, 'getUsers').and.returnValue(Observable.of([]));
                apiService.setResponse(leonardoUserResponse);
                apiService.init();
                userService.createUser(newUser).subscribe(
                    user => createdUser = user,
                    error => {}
                );
                tick();
                expect(createdUser).toEqual(leonardoUserObject);
            }))
        );

        it('should throw an error if username already exists',
            inject([ApiService, UserService], fakeAsync((apiService: MockApiService, userService: UserService) => {
                let newUser: User = Object.assign({}, leonardoUserObject);
                delete newUser.id;
                let createdUser: User = null;
                let errorMessage: string = "";

                spyOn(userService, 'getUsers').and.returnValues(Observable.of([]), Observable.of([leonardoUserObject]));

                apiService.setResponse(null);
                apiService.init();
                userService.createUser(newUser).subscribe(
                    user => createdUser = user,
                    error => errorMessage = error.message
                );
                tick();

                let getUsersArgument = (<any>userService.getUsers).calls.mostRecent().args[0];
                expect(getUsersArgument.get('username')).toBe('Leo');
                expect(createdUser).toEqual(null);
                expect(errorMessage).toBe("Korisnik sa datim korisničkim imenom već postoji.")
            }))
        );

        it('should throw an error if email already exists',
            inject([ApiService, UserService], fakeAsync((apiService: MockApiService, userService: UserService) => {
                let newUser: User = Object.assign({}, leonardoUserObject);
                delete newUser.id;
                let createdUser: User = null;
                let errorMessage: string = "";

                spyOn(userService, 'getUsers').and.returnValues(Observable.of([leonardoUserObject]), Observable.of([]));

                apiService.setResponse(null);
                apiService.init();
                userService.createUser(newUser).subscribe(
                    user => createdUser = user,
                    error => errorMessage = error.message
                );
                tick();

                let getUsersArgument = (<any>userService.getUsers).calls.first().args[0];
                expect(getUsersArgument.get('email')).toBe('gmail@leo.com');
                expect(createdUser).toEqual(null);
                expect(errorMessage).toBe("Korisnik sa datiom e-mail adresom već postoji.")
            }))
        );
    });

    describe('deleteUser', () => {
        it('should send delete request at the right user path to api service', inject(
            [ApiService, UserService],
            (apiService: MockApiService, userService: UserService) => {
                apiService.setResponse({});
                apiService.init();
                userService.deleteUser(1).subscribe();

                expect(apiService.delete).toHaveBeenCalledWith('users/1');
            }
        ));
    });

    describe('updateUser', () => {
        it('should send the right update data to api service put action', inject(
            [ApiService, UserService],
            (apiService: MockApiService, userService: UserService) => {
                let updatedUserPutResponse = Object.assign({}, leonardoUserResponse);

                let updateUser = Object.assign({}, leonardoUserObject);

                let updateUserRequest = Object.assign({}, leonardoUserObject);

                apiService.setResponse(updatedUserPutResponse);
                apiService.init();
                userService.updateUser(1, updateUser).subscribe();

                expect(apiService.put).toHaveBeenCalledWith('users/1', updateUserRequest);
            }
        ));
    });
});
