import { ParticipantGuard } from './participant.guard';
import {TestBed, inject} from "@angular/core/testing";
import {AuthService} from "../../services/authentication/auth.service";
import {Router} from "@angular/router";
import {MockRouter} from "../../test/mock.router";
import {UserService} from "../../services/user/user.service";
import {ApiService} from "../../services/api/api.service";
import {HttpModule} from "@angular/http";

describe('ParticipantGuard', () => {
    let participantGuard: ParticipantGuard;
    let pass: boolean;

    function initGuard(authService: AuthService, router: MockRouter, loggedIn: boolean) {
        spyOn(authService, 'isLoggedIn').and.returnValue(loggedIn);
        participantGuard = new ParticipantGuard(authService, router as Router);
        pass = participantGuard.canActivate(null, null);
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

    it('returns true if the user is logged in', inject([AuthService, Router],
        (authService: AuthService, router: MockRouter) => {
            initGuard(authService, router, true);
            expect(pass).toBe(true);
        }
    ));

    it('returns false if the user is not logged in', inject([AuthService, Router],
        (authService: AuthService, router: MockRouter) => {
            initGuard(authService, router, false);
            expect(pass).toBe(false);
        }
    ));

    it('redirects to /login if the user is not logged in', inject([AuthService, Router],
        (authService: AuthService, router: MockRouter) => {
            initGuard(authService, router, false);
            expect(router.navigate).toHaveBeenCalledWith(['/login']);
        }
    ));
});