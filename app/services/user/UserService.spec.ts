import {fakeAsync, inject, tick, TestBed} from "@angular/core/testing";
import 'rxjs/add/operator/map';

import {ApiService} from "../api/ApiService";
import {MockApiService} from "../api/MockApiService";
import { UserService } from './UserService';
import {User} from "../../data/User";

describe('UserService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                UserService,
                ApiService,
                {
                    provide: ApiService,
                    useClass: MockApiService
                }
            ]
        });
    });

    it('gets a user from the api', inject([ApiService, UserService], fakeAsync(
        (apiService: MockApiService, userService: UserService) => {
            let userId = 1;
            let birthdayString = "1452-04-15T16:00:00.000Z";
            let birthday = new Date(birthdayString);
            let userResponse: any = {
                name: "Leonardo",
                surname: "da Vinci",
                type: "administrator",
                username: "Leo",
                password: "turtlePower",
                birthday: birthdayString,
                phone: "113591525",
                email: "gmail@leo.com",
                id: userId
            };

            let expectedUser: User = {
                name: "Leonardo",
                surname: "da Vinci",
                type: "administrator",
                username: "Leo",
                password: "turtlePower",
                birthday: birthday,
                phone: "113591525",
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
                    type: "administrator",
                    username: "Leo",
                    password: "turtlePower",
                    birthday: birthdayString,
                    phone: "113591525",
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
                    type: "administrator",
                    username: "Leo",
                    password: "turtlePower",
                    birthday: birthdayString,
                    phone: "113591525",
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
