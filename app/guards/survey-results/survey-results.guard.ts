import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from "@angular/router";
import {SurveyService} from "../../services/survey/survey.service";
import {AuthService} from "../../services/authentication/auth.service";
import {Observable} from "rxjs/Rx";
import {Survey} from "../../data/survey.data";
import {userTypes} from "../../data/user.data";

@Injectable()
export class SurveyResultsGuard implements CanActivate {
    constructor(private surveyService: SurveyService, private authService: AuthService) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        let currentUser = this.authService.getLoggedInUser();
        if(currentUser.type == userTypes.administrator)
            return Observable.of(true);

        let surveyId = route.params['surveyId'];
        return this.surveyService.getSurvey(surveyId)
            .map((survey: Survey) => survey.author.id == currentUser.id)
            .catch(_ => Observable.of(false));
    }
}