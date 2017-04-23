import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from "@angular/router";
import {SurveyService} from "../../services/survey/survey.service";
import {AuthService} from "../../services/authentication/auth.service";
import {Observable} from "rxjs/Rx";
import {Survey} from "../../data/survey.data";
import {userTypes} from "../../data/user.data";
import * as moment from 'moment/moment';

@Injectable()
export class SurveyEditGuard implements CanActivate {
    constructor(private surveyService: SurveyService, private authService: AuthService) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        let currentUser = this.authService.getLoggedInUser();

        let surveyId = route.params['surveyId'];
        return this.surveyService.getSurvey(surveyId)
            .map((survey: Survey) => {
                if(!moment().isBefore(moment(survey.start))) return false;
                return survey.author.id == currentUser.id || currentUser.type == userTypes.administrator;
            })
            .catch(_ => Observable.of(false));
    }
}
