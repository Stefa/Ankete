import {fakeAsync, inject, tick, TestBed} from "@angular/core/testing";
import 'rxjs/add/operator/map';

import {ApiService} from "../api/ApiService";
import {MockApiService} from "../api/MockApiService";
import { UserService } from './UserService';
import {User, userTypes} from "../../data/User";

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
                let birthdayString = "1452-04-15T16:00:00.000Z";
                let birthday = new Date(birthdayString);
                let userResponse: any = {
                    name: "Leonardo",
                    surname: "da Vinci",
                    type: userTypes.administrator,
                    username: "Leo",
                    password: "turtlePower",
                    birthday: birthdayString,
                    phone: "161803398",
                    email: "gmail@leo.com",
                    id: userId
                };

                let expectedUser: User = {
                    name: "Leonardo",
                    surname: "da Vinci",
                    type: userTypes.administrator,
                    username: "Leo",
                    password: "turtlePower",
                    birthday: birthday,
                    phone: "161803398",
                    email: "gmail@leo.com",
                    id: userId
                };

                let user: User;
                apiService.setResponse(userResponse);
                apiService.init();
                userService.getUser(userId).subscribe((res: User) => user = res);
                tick();
                expect(apiService.get).toHaveBeenCalledWith('users/1');
                expect(user).toEqual(expectedUser);
            }
        )));

        it('throws error when user does not have any of required properties', inject(
            [ApiService, UserService],
            fakeAsync(
                (apiService: MockApiService, userService: UserService) => {
                    let userId = 1;
                    let birthdayString = "1452-04-15T16:00:00.000Z";
                    // surname is missing
                    let userResponse: any = {
                        name: "Leonardo",
                        type: userTypes.administrator,
                        username: "Leo",
                        password: "turtlePower",
                        birthday: birthdayString,
                        phone: "161803398",
                        email: "gmail@leo.com",
                        id: userId
                    };

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
                    let birthdayString = "1452-04-15T16:00:00.000Z";
                    // weapon_of_choice is not valid property
                    let userResponse: any = {
                        name: "Leonardo",
                        surname: "da Vinci",
                        type: userTypes.administrator,
                        username: "Leo",
                        password: "turtlePower",
                        birthday: birthdayString,
                        phone: "161803398",
                        email: "gmail@leo.com",
                        id: userId,
                        weapon_of_choice: 'Katana'
                    };

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
                    let birthdayString1 = "1452-04-15T16:00:00.000Z";
                    let birthdayString2 = "1173-03-25T21:00:00.000Z";
                    let birthday1 = new Date(birthdayString1);
                    let birthday2 = new Date(birthdayString2);
                    let userResponse1: any = {
                        name: "Leonardo",
                        surname: "da Vinci",
                        type: userTypes.administrator,
                        username: "Leo",
                        password: "turtlePower",
                        birthday: birthdayString1,
                        phone: "161803398",
                        email: "gmail@leo.com",
                        id: 1
                    };
                    let userResponse2: any = {
                        name: "Leonardo",
                        surname: "Bonacci",
                        type: userTypes.administrator,
                        username: "Fibonacci",
                        password: "a84cu5",
                        birthday: birthdayString2,
                        phone: "113591525",
                        email: "yahoo@fibonacci.com",
                        id: 2
                    };

                    let expectedUser1: User = {
                        name: "Leonardo",
                        surname: "da Vinci",
                        type: userTypes.administrator,
                        username: "Leo",
                        password: "turtlePower",
                        birthday: birthday1,
                        phone: "161803398",
                        email: "gmail@leo.com",
                        id: 1
                    };

                    let expectedUser2: User = {
                        name: "Leonardo",
                        surname: "Bonacci",
                        type: userTypes.administrator,
                        username: "Fibonacci",
                        password: "a84cu5",
                        birthday: birthday2,
                        phone: "113591525",
                        email: "yahoo@fibonacci.com",
                        id: 2
                    };

                    let user1: User, user2: User;
                    let query: Map<string, string> = new Map(<[string,string][]>[['name', 'Leonardo']]);
                    apiService.setResponse([userResponse1, userResponse2]);
                    apiService.init();
                    userService.getUsers(query).subscribe((res: User[]) => [user1, user2] = res);
                    tick();

                    expect(apiService.get).toHaveBeenCalledWith('users?name=Leonardo');
                    expect(user1).toEqual(expectedUser1);
                    expect(user2).toEqual(expectedUser2);
                }
            )
        ));

        it('gets the users by specified properties', inject(
            [ApiService, UserService],
            fakeAsync(
                (apiService: MockApiService, userService: UserService) => {
                    let birthdayString1 = "1452-04-15T16:00:00.000Z";
                    let birthdayString2 = "1173-03-25T21:00:00.000Z";
                    let birthday1 = new Date(birthdayString1);
                    let birthday2 = new Date(birthdayString2);
                    let userResponse1: any = {
                        name: "Leonardo",
                        surname: "da Vinci",
                        type: userTypes.administrator,
                        username: "Leo",
                        password: "turtlePower",
                        birthday: birthdayString1,
                        phone: "161803398",
                        email: "gmail@leo.com",
                        id: 1
                    };
                    let userResponse2: any = {
                        name: "Leonardo",
                        surname: "Bonacci",
                        type: userTypes.administrator,
                        username: "Fibonacci",
                        password: "a84cu5",
                        birthday: birthdayString2,
                        phone: "113591525",
                        email: "yahoo@fibonacci.com",
                        id: 2
                    };

                    let expectedUser1: User = {
                        name: "Leonardo",
                        surname: "da Vinci",
                        type: userTypes.administrator,
                        username: "Leo",
                        password: "turtlePower",
                        birthday: birthday1,
                        phone: "161803398",
                        email: "gmail@leo.com",
                        id: 1
                    };

                    let expectedUser2: User = {
                        name: "Leonardo",
                        surname: "Bonacci",
                        type: userTypes.administrator,
                        username: "Fibonacci",
                        password: "a84cu5",
                        birthday: birthday2,
                        phone: "113591525",
                        email: "yahoo@fibonacci.com",
                        id: 2
                    };

                    let user1: User, user2: User;
                    let query: Map<string, string> = new Map(<[string,string][]>[['name', 'Leonardo'], ['type', 'administrator']]);
                    apiService.setResponse([userResponse1, userResponse2]);
                    apiService.init();
                    userService.getUsers(query).subscribe((res: User[]) => [user1, user2] = res);
                    tick();

                    expect(apiService.get).toHaveBeenCalledWith('users?name=Leonardo&type=administrator');
                    expect(user1).toEqual(expectedUser1);
                    expect(user2).toEqual(expectedUser2);
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
                    let birthdayString = "1452-04-15T16:00:00.000Z";
                    let userResponse: any = {
                        name: "Leonardo",
                        surname: "da Vinci",
                        type: userTypes.administrator,
                        username: "Leo",
                        password: "turtlePower",
                        birthday: birthdayString,
                        phone: "161803398",
                        email: "gmail@leo.com",
                        id: 1
                    };
                    apiService.setResponse([userResponse]);
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
