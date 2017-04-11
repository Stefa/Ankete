import { Injectable }     from '@angular/core';
import {ActivatedRouteSnapshot, RouterStateSnapshot, Resolve}    from '@angular/router';
import {SurveyService} from "../../services/survey/survey.service";
import {Survey} from "../../data/survey.data";
import {Observable} from "rxjs/Rx";
import {AuthService} from "../../services/authentication/auth.service";

@Injectable()
export class UserSurveysResolverGuard implements Resolve<Array<Survey>> {
    constructor(private surveyService: SurveyService, private authService: AuthService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Array<Survey>> {
        let user = this.authService.getLoggedInUser();
        return this.surveyService.getUserSurveys(user.id);
    }
}


