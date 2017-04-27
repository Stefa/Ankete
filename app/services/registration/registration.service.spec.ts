import {async, fakeAsync, inject, TestBed} from "@angular/core/testing";
import {MockApiService} from "../api/mock-api.service";
import {ApiService} from "../api/api.service";
import {RegistrationService} from "./registration.service";
import {Registration} from "../../data/registration.data";
import {userTypes} from "../../data/user.data";

describe('RegistrationService', () => {
    beforeEach( async(() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [],
            providers: [
                RegistrationService,
                {
                    provide: ApiService,
                    useClass: MockApiService
                }
            ]
        })
    }));

    describe('createRegistration', () => {
        let newRegistration: Registration = {
            name: "Winston",
            surname: "Smith",
            type: userTypes.participant,
            username: "SmithW",
            password: "four",
            birthday: new Date("1945-04-15T16:00:00.000Z"),
            phone: "225225",
            email: "smith@bbrules.com"
        };

        let newRegistrationApiResponse = $.extend(true, {}, newRegistration);
        newRegistrationApiResponse.birthday = "1945-04-15T16:00:00.000Z";
        newRegistrationApiResponse.id = 1;

        it('should send post request to the api', inject([ApiService, RegistrationService],
            fakeAsync((apiService: MockApiService, registrationService: RegistrationService) => {
                apiService.setResponse(newRegistrationApiResponse);
                apiService.init();
                registrationService.createRegistration(newRegistration).subscribe();
                expect(apiService.post).toHaveBeenCalledWith('registrations', newRegistration);
            }))
        );

        it('should return true if api returned valid data', inject([ApiService, RegistrationService],
            fakeAsync((apiService: MockApiService, registrationService: RegistrationService) => {
                let created: boolean;
                apiService.setResponse(newRegistrationApiResponse);
                apiService.init();
                registrationService.createRegistration(newRegistration).subscribe(
                    success => created = success
                );
                expect(created).toBe(true);
            })
        ));
    });

    describe('deleteRegistration', () => {
        it('should send delete request at the right registration path to api service', inject(
            [ApiService, RegistrationService],
            (apiService: MockApiService, registrationService: RegistrationService) => {
                apiService.setResponse({});
                apiService.init();
                registrationService.deleteRegistration(1).subscribe();

                expect(apiService.delete).toHaveBeenCalledWith('registrations/1');
            }
        ));
    });

    describe('getRegistrations', () => {
        let apiResponse: any = [
            {
                id: 1,
                name: "Winston",
                surname: "Smith",
                type: userTypes.participant,
                username: "SmithW",
                password: "four",
                birthday: "1945-04-15T16:00:00.000Z",
                phone: "225225",
                email: "smith@bbrules.com"
            },
            {
                id: 2,
                name: "Julia",
                surname: "Dixon",
                type: userTypes.participant,
                username: "JuliaD",
                password: "1234",
                birthday: "1963-02-25T14:00:00.000Z",
                phone: "654321",
                email: "julia@bbrules.com"
            }
        ];
        let methodResponse = apiResponse.map(registration => {
            return $.extend(true, {}, registration, {birthday: new Date(registration.birthday)})
        });

        it('should send get request to right api url', inject(
            [ApiService, RegistrationService],
            fakeAsync((apiService: MockApiService, registrationService: RegistrationService) => {
                let returnValue;
                apiService.setResponse(apiResponse);
                apiService.init();
                registrationService.getRegistrations().subscribe(
                    registrations => returnValue = registrations
                );
                expect(apiService.get).toHaveBeenCalledWith('registrations');
                expect(returnValue).toEqual(methodResponse);
            })
        ));
    });
});