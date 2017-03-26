import {Injectable} from "@angular/core";
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {Progress} from "../../data/progress.data";
import {ProgressService} from "../../services/progress/progress.service";
import {Observable} from "rxjs/Rx";
import {AuthService} from "../../services/authentication/auth.service";

@Injectable()
export class ProgressResolverGuard implements Resolve<Progress> {
    constructor(private progressService: ProgressService, private authService: AuthService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Progress> {
        let surveyId = route.params['surveyId'];
        let progressId = route.params['progressId'];

        let progress$ = ('progressId' in route.params)
            ? this.getProgressById(progressId) : this.getUsersProgress(surveyId);

        return progress$.catch(_ => {
            return Observable.of(null);
        });
    }

    private getUsersProgress(surveyId) {
        let userId = this.authService.getLoggedInUser().id;
        return this.progressService
            .getProgressWithAnswersBySurveyAndUser(surveyId, userId)
    }

    private getProgressById(progressId) {
        return this.progressService.getProgressWithAnswersById(progressId);
    }
}