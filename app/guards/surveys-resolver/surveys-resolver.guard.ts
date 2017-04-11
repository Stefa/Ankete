import { Injectable }     from '@angular/core';
import {ActivatedRouteSnapshot, RouterStateSnapshot, Resolve}    from '@angular/router';
import {SurveyService} from "../../services/survey/survey.service";
import {Survey} from "../../data/survey.data";
import {Observable} from "rxjs/Rx";

@Injectable()
export class SurveysResolverGuard implements Resolve<Array<Survey>> {
    constructor(private surveyService: SurveyService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Array<Survey>> {
        return this.surveyService.getSurveys();
    }
}

