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

    it('gets a user from api', inject([ApiService, UserService], fakeAsync(
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

            let user: User = null;
            apiService.setResponse(userResponse);
            userService.getUser(userId).subscribe((res: User) => user = res);
            tick();
            expect(apiService.get).toHaveBeenCalledWith('users/1');
            expect(user).toEqual(expectedUser)
        }
    )));
});
