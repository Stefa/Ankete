import {Injectable} from "@angular/core";
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {Progress} from "../../data/progress.data";
import {ProgressService} from "../../services/progress/progress.service";
import {Observable} from "rxjs/Rx";

@Injectable()
export class FinishedProgressResolverGuard implements Resolve<Progress[]> {
    constructor(private progressService: ProgressService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Progress[]> {
        let surveyId = route.params['surveyId'];
        return this.progressService.getFinishedProgressBySurvey(surveyId)
            .catch(_ => Observable.of([]));
    }
}