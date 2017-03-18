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
        let userId = this.authService.getLoggedInUser().id;
        return this.progressService
            .getProgressWithAnswers(surveyId, userId)
            .catch(_ => {
                return Observable.of(null);
            });
    }
}