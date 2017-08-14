import { Injectable }     from '@angular/core';
import {ActivatedRouteSnapshot, RouterStateSnapshot, Resolve}    from '@angular/router';
import {Observable} from "rxjs/Rx";
import {QuestionService} from "../../services/question/question.service";

@Injectable()
export class AnswersResolverGuard implements Resolve<Array<any>> {
    constructor(private questionService: QuestionService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Array<any>> {
        let surveyId = route.params['surveyId'];
        return this.questionService.getSurveyQuestionsWithAnswers(surveyId);
    }
}


