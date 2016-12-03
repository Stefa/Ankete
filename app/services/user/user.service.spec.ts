import {fakeAsync, inject, tick, TestBed} from "@angular/core/testing";
import 'rxjs/add/operator/map';

import {ApiService} from "../api/api.service";
import {MockApiService} from "../api/mock-api.service";
import { UserService } from './user.service';
import {User} from "../../data/user.data";

import { leonardoUserObject, leonardoUserResponse, fibonacciUserResponse, fibonacciUserObject } from '../../test/users';

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
        it('gets a user from the api', inject([ApiService, UserService], fakeAsync(
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

        it('throws error when user does not have any of required properties', inject(
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
                        (error: any) => errorMessage = error
                    );
                    tick();
                    expect(user).not.toBeDefined();
                    expect(errorMessage).toBe('User structure is not valid!');
                }
            )
        ));

        it('throws error when user has an invalid property', inject(
            [ApiService, UserService],
            fakeAsync(
                (apiService: MockApiService, userService: UserService) => {
                    let userId = 1;
                    let userResponse = Object.assign({}, leonardoUserResponse);
                    userResponse.weapon_of_choice = 'Katana';

                    let user: any;
                    let errorMessage: any;

                    apiService.setResponse(userResponse);
                    apiService.init();

                    userService.getUser(userId).subscribe(
                        (res: User) => user = res,
                        (error: any) => errorMessage = error
                    );
                    tick();
                    expect(user).not.toBeDefined();
                    expect(errorMessage).toBe('User structure is not valid!');
                }
            )
        ));

        it('throws error when user is not found', inject(
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
                        (error: any) => errorMessage = error
                    );
                    tick();
                    expect(user).not.toBeDefined();
                    expect(errorMessage).toBe('Requested user does not exist!');
                }
            )
        ));
    });

    describe('getUsers', () => {
        it('gets the users by specified property', inject(
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

        it('gets the users by specified properties', inject(
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

        it('throws an error if the query parameter has invalid user property', inject(
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
                        (error: any) => errorMessage = error
                    );
                    tick();

                    expect(apiService.get).not.toHaveBeenCalled();
                    expect(user).not.toBeDefined();
                    expect(errorMessage).toBe('Tried to query users by wrong field: age!');
                }
            )
        ));
    });

});
