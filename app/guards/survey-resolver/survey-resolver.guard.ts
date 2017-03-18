import { Injectable }     from '@angular/core';
import {ActivatedRouteSnapshot, RouterStateSnapshot, Resolve, Router}    from '@angular/router';
import {SurveyService} from "../../services/survey/survey.service";
import {Survey} from "../../data/survey.data";
import {Observable} from "rxjs/Rx";

@Injectable()
export class SurveyResolverGuard implements Resolve<Survey> {
    constructor(private surveyService: SurveyService, private router: Router) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Survey> {
        let surveyId = route.params['surveyId'];
        return this.surveyService
            .getSurveyWithQuestions(surveyId)
            .map(survey => {
                if(survey.blocked) {
                    this.router.navigate(['/']);
                    return {};
                }
                return survey;
            })
            .catch(error => {
                this.router.navigate(['/']);
                return Observable.of({});
            });
    }
}
