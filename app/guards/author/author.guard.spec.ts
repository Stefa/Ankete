import {AuthorGuard} from './author.guard';
import {TestBed, inject} from "@angular/core/testing";
import {AuthService} from "../../services/authentication/auth.service";
import {Router} from "@angular/router";
import {MockRouter} from "../../test/mock.router";
import {UserService} from "../../services/user/user.service";
import {ApiService} from "../../services/api/api.service";
import {HttpModule} from "@angular/http";
import {User, userTypes} from "../../data/user.data";
import {leonardoUserObject} from "../../test/users";

describe('AuthorGuard', () => {
    let authorGuard: AuthorGuard;
    let pass: boolean;

    function initGuard(authService: AuthService, router: MockRouter, loggedIn: boolean, user: User) {
        spyOn(authService, 'isLoggedIn').and.returnValue(loggedIn);
        spyOn(authService, 'getLoggedInUser').and.returnValue(user);
        authorGuard = new AuthorGuard(authService, router as Router);
        pass = authorGuard.canActivate(null, null);
    }

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule],
            providers: [
                AuthService, UserService, ApiService,
                {provide: Router, useClass: MockRouter}
            ]
        });
    });

    [userTypes.author, userTypes.administrator].forEach(type => {
        it(`should return true if the user is logged in and user type is ${type}`, inject([AuthService, Router],
            (authService: AuthService, router: MockRouter) => {
                let loggedInUser = Object.assign({}, leonardoUserObject);
                loggedInUser.type = type;
                initGuard(authService, router, true, loggedInUser);
                expect(pass).toBe(true);
            }
        ));
    });

    [userTypes.participant, userTypes.clerk].forEach(type => {
        it(`should return false if the user is logged in and user type is ${type}`, inject([AuthService, Router],
            (authService: AuthService, router: MockRouter) => {
                let loggedInUser = Object.assign({}, leonardoUserObject);
                loggedInUser.type = userTypes.participant;
                initGuard(authService, router, false, loggedInUser);
                expect(pass).toBe(false);
            }
        ));
    });

    it('should return false if the user is not logged in', inject([AuthService, Router],
        (authService: AuthService, router: MockRouter) => {
            initGuard(authService, router, false, null);
            expect(pass).toBe(false);
        }
    ));

    it('should redirect to /login if the user is not logged in', inject([AuthService, Router],
        (authService: AuthService, router: MockRouter) => {
            initGuard(authService, router, false, null);
            expect(router.navigate).toHaveBeenCalledWith(['/login']);
        }
    ));
});

