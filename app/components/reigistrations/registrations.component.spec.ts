import {RegistrationsComponent} from "./registrations.component";
import {async, ComponentFixture, inject, TestBed} from "@angular/core/testing";
import {MockActivatedRoute} from "../../test/mock.activated-route";
import {ActivatedRoute} from "@angular/router";
import {userTypes} from "../../data/user.data";
import {By} from "@angular/platform-browser";
import {UserService} from "../../services/user/user.service";
import {RegistrationService} from "../../services/registration/registration.service";
import {ApiService} from "../../services/api/api.service";
import {HttpModule} from "@angular/http";

describe('RegistrationsComponent', () => {
    let fixture: ComponentFixture<RegistrationsComponent>;
    let comp: RegistrationsComponent;

    beforeEach( async(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule],
            declarations: [RegistrationsComponent],
            providers: [
                UserService, RegistrationService, ApiService,
                {provide: ActivatedRoute, useClass: MockActivatedRoute}
            ]
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(RegistrationsComponent);
                comp    = fixture.componentInstance;
            });
    }));

    let dataRegistrations: any = [
        {
            id: 1,
            name: "Winston",
            surname: "Smith",
            type: userTypes.participant,
            username: "SmithW",
            password: "four",
            birthday: new Date("1945-04-15T16:00:00.000Z"),
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
            birthday: new Date("1963-02-25T14:00:00.000Z"),
            phone: "654321",
            email: "julia@bbrules.com"
        }
    ];

    let registrationRows: Array<any>;

    function setActivatedRoute(route: MockActivatedRoute) {
        route.testData = {
            registrations: dataRegistrations,
        };
    }

    function getRegistrations() {
        registrationRows = fixture.debugElement.queryAll(By.css('.registration'))
            .map(resultDebugElement => resultDebugElement.nativeElement);
    }

    it('should display table with all registrations', inject([ActivatedRoute],
        (route: MockActivatedRoute) => {
            setActivatedRoute(route);
            fixture.detectChanges();
            getRegistrations();
            expect(registrationRows.length).toBe(2);
        }
    ));

    it('should display user data in each row', inject([ActivatedRoute],
        (route: MockActivatedRoute) => {
            setActivatedRoute(route);
            fixture.detectChanges();
            getRegistrations();

            let registration1 = registrationRows[0];
            expect(registration1.innerHTML).toContain('Ispitanik');
            expect(registration1.innerHTML).toContain('Winston');
            expect(registration1.innerHTML).toContain('Smith');
            expect(registration1.innerHTML).toContain('SmithW');
            expect(registration1.innerHTML).toContain('15. 4. 1945.');
            expect(registration1.innerHTML).toContain('225225');
            expect(registration1.innerHTML).toContain('smith@bbrules.com');
        }
    ));

});
