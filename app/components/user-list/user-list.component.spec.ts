import {UserListComponent} from "./user-list.component";
import {async, ComponentFixture, inject, TestBed} from "@angular/core/testing";
import {User, userTypes} from "../../data/user.data";
import {MockActivatedRoute} from "../../test/mock.activated-route";
import {AuthService} from "../../services/authentication/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../../services/user/user.service";
import {ApiService} from "../../services/api/api.service";
import {HttpModule} from "@angular/http";
import {By} from "@angular/platform-browser";
import {Observable} from "rxjs/Observable";
import {MockRouter} from "../../test/mock.router";

describe('UserListComponent', () => {
    let fixture: ComponentFixture<UserListComponent>;
    let comp: UserListComponent;

    let winston = {
        id: 1,
        name: "Winston",
        surname: "Smith",
        type: userTypes.participant,
        username: "SmithW",
        password: "four",
        birthday: new Date("1945-04-15T16:00:00.000Z"),
        phone: "225225",
        email: "smith@bbrules.com"
    };
    let julia = {
        id: 2,
        name: "Julia",
        surname: "Dixon",
        type: userTypes.participant,
        username: "JuliaD",
        password: "1234",
        birthday: new Date("1963-02-25T14:00:00.000Z"),
        phone: "654321",
        email: "julia@bbrules.com"
    };
    let obrien = {
        id: 3,
        name: "O",
        surname: "Brien",
        type: userTypes.administrator,
        username: "Brotherhood",
        password: "12345",
        birthday: new Date("1947-02-25T14:00:00.000Z"),
        phone: "654321",
        email: "obrien@bbrules.com"
    };

    let userRows: Array<any>;

    function setActivatedRoute(route: MockActivatedRoute) {
        let resolvedUsers: Array<User> = [winston, julia, obrien];
        route.testData = {
            users: resolvedUsers,
        };
    }

    function getUserRows() {
        userRows = fixture.debugElement.queryAll(By.css('.user'));
    }

    beforeEach( async(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule],
            declarations: [UserListComponent],
            providers: [
                UserService, AuthService, ApiService,
                {provide: Router, useClass: MockRouter},
                {provide: ActivatedRoute, useClass: MockActivatedRoute}
            ]
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(UserListComponent);
                comp    = fixture.componentInstance;
            });
    }));

    it('should display table with users', inject([ActivatedRoute, AuthService],
        (route: MockActivatedRoute, authService: AuthService) => {
            setActivatedRoute(route);
            spyOn(authService, 'getLoggedInUser').and.returnValue(obrien);
            fixture.detectChanges();
            getUserRows();
            expect(userRows.length).toBe(2);
        }
    ));

    it('should all the users except for currently logged in user', inject([ActivatedRoute, AuthService],
        (route: MockActivatedRoute, authService: AuthService) => {
            setActivatedRoute(route);
            spyOn(authService, 'getLoggedInUser').and.returnValue(obrien);
            fixture.detectChanges();
            getUserRows();
            expect(userRows[0].nativeElement.innerHTML).toContain("Winston Smith");
            expect(userRows[1].nativeElement.innerHTML).toContain("Julia Dixon");
        }
    ));

    describe('delete user', () => {
        it('should call deleteUser method of UserService', inject([ActivatedRoute, AuthService, UserService],
            (route: MockActivatedRoute, authService: AuthService, userService: UserService) => {
                setActivatedRoute(route);
                spyOn(authService, 'getLoggedInUser').and.returnValue(obrien);
                spyOn(userService, 'deleteUser').and.returnValue(Observable.of(true));
                fixture.detectChanges();
                getUserRows();

                let deleteButton = userRows[0].query(By.css('.delete'));
                deleteButton.triggerEventHandler('click', new Event('click'));
                fixture.detectChanges();

                expect(userService.deleteUser).toHaveBeenCalledWith(1);
            }
        ));

        it('should remove deleted user from the list', inject([ActivatedRoute, AuthService, UserService],
            (route: MockActivatedRoute, authService: AuthService, userService: UserService) => {
                setActivatedRoute(route);
                spyOn(authService, 'getLoggedInUser').and.returnValue(obrien);
                spyOn(userService, 'deleteUser').and.returnValue(Observable.of(true));
                fixture.detectChanges();
                getUserRows();

                let deleteButton = userRows[0].query(By.css('.delete'));
                deleteButton.triggerEventHandler('click', new Event('click'));
                fixture.detectChanges();

                expect(comp.users.length).toBe(1);
            }
        ));
    });
});