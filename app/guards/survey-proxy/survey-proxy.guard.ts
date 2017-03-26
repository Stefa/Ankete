import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate} from "@angular/router";
import {ProgressService} from "../../services/progress/progress.service";
import {Observable} from "rxjs/Rx";
import {AuthService} from "../../services/authentication/auth.service";

@Injectable()
export class SurveyProxyGuard implements CanActivate {
    constructor(private progressService: ProgressService, private authService: AuthService) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        let progressId = route.params['progressId'];
        let surveyId = route.params['surveyId'];

        let userId = this.authService.getLoggedInUser().id;
        return this.progressService
            .getProgressWithAnswersById(progressId)
            .map(progress => {
                return 'userData' in progress && progress.user.id == userId && progress.survey.id == surveyId;
            })
            .catch(_ => {
                return Observable.of(false);
            });
    }
}