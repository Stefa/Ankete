import { Injectable } from '@angular/core';
import {ApiService} from "../api/api.service";
import {Survey} from "../../data/survey.data";
import {SurveyDataValidator} from "../../data-validators/survey/survey.data-validator";
import {Observable} from 'rxjs/Rx';
import {QuestionService} from "../question/question.service";

@Injectable()
export class SurveyService {

    constructor(public api: ApiService, public questionService: QuestionService) { }

    getSurvey(surveyId: number): Observable<Survey> {
        return this.api.get('surveys/'+surveyId).map((res:any) => {
            if(SurveyDataValidator.checkIfSurveyApiResponseIsValid(res)) {
                return SurveyService.createSurveyObjectFromResponse(res);
            }

            throw new Error('Dobijen je pogrešan odgovor sa servera pri kreiranju ankete.');
        }).catch((error: any) => {
            let errorMessage: string = error.message;
            if(error.hasOwnProperty('status') && error.status === 404) {
                errorMessage = 'Tražena anketa ne postoji.'
            }
            if(errorMessage.startsWith('Error: ')) {
                errorMessage = errorMessage.substring(8);
            }
            return Observable.throw(new Error(errorMessage));
        });
    }

    createSurvey(survey: Survey) {
        if(!SurveyDataValidator.checkIfSurveyObjectHasRequiredFields(survey)) {
            return Observable.throw(new Error("Anketa nema definisana sva obavezna polja."));
        }
        let surveyRequest = this.prepareSurveyRequest(survey);

        return this.api.post('surveys', surveyRequest).map((res:any) => {
            if(SurveyDataValidator.checkIfSurveyApiResponseIsValid(res)) {
                return SurveyService.createSurveyObjectFromResponse(res);
            }

            throw new Error('Dobijen je pogrešan odgovor sa servera pri kreiranju ankete.');
        });
    }

    private prepareSurveyRequest(survey: Survey) {
        let surveyRequest: any = Object.assign({}, survey);

        delete surveyRequest.id;

        surveyRequest.userId = survey.author.id;
        delete surveyRequest.author;

        return surveyRequest;
    }

    static createSurveyObjectFromResponse(surveyResponse): Survey {
        let createdSurvey = Object.assign(
            {author: {id: surveyResponse.userId}},
            surveyResponse,
            {
                start: new Date(surveyResponse.start),
                end: new Date(surveyResponse.end)
            }
        );
        if('user' in createdSurvey) {
            createdSurvey.author = createdSurvey.user;
            delete createdSurvey.user;
        }
        delete createdSurvey.userId;
        return createdSurvey
    }

    blockSurvey(surveyId: number): Observable<Survey> {
        return this.api.patch('surveys/'+surveyId, {blocked: true})
            .map(SurveyService.createSurveyObjectFromResponse)
            .catch((error: any) => {
                let errorMessage: string = error.message;
                if(error.hasOwnProperty('status') && error.status === 404) {
                    errorMessage = 'Tražena anketa ne postoji.'
                }
                if(errorMessage.startsWith('Error: ')) {
                    errorMessage = errorMessage.substring(8);
                }
                return Observable.throw(new Error(errorMessage));
            });
    }

    getFullSurvey(surveyId: number): Observable<any> {
        return this.api.get(`surveys/${surveyId}?_embed=questions&_expand=user`).map((res:any) => {
            if(!SurveyDataValidator.checkIfSurveyApiResponseIsValid(res)) {
                throw new Error('Dobijen je pogrešan odgovor sa servera pri kreiranju ankete.');
            }
            let survey = SurveyService.createSurveyObjectFromResponse(res);
            survey.questions = survey.questions.map(this.questionService.createQuestionFromApiResponse);

            survey.questions = survey.questions.sort((q1, q2) => {
                let q1Pos = survey.questionOrder.indexOf(q1.id);
                let q2Pos = survey.questionOrder.indexOf(q2.id);
                return q1Pos < q2Pos ? -1 : 1;
            });

            return survey;
        }).catch((error: any) => {
            let errorMessage: string = error.message;
            if(error.hasOwnProperty('status') && error.status === 404) {
                errorMessage = 'Tražena anketa ne postoji.'
            }
            if(errorMessage.startsWith('Error: ')) {
                errorMessage = errorMessage.substring(8);
            }
            return Observable.throw(new Error(errorMessage));
        });
    }

    getSurveys(): Observable<Array<Survey>> {
        return this.api.get('surveys').map((res: any) => {
            return res
                .map(SurveyService.createSurveyObjectFromResponse)
                .filter(survey => !survey.blocked);
        });
    }

    getUserSurveys(userId: number): Observable<Array<Survey>> {
        return this.api.get('surveys?userId='+userId).map((res: any) => {
            return res
                .map(SurveyService.createSurveyObjectFromResponse)
                .filter(survey => !survey.blocked);
        });
    }

    deleteSurvey(surveyId: number): Observable<boolean> {
        this.questionService.getSurveyQuestions(surveyId).subscribe(questions => {
            questions.forEach(
                question => this.questionService.deleteQuestion(question.id)
            );
        });

        return this.api
            .delete('surveys/'+surveyId)
            .map(_ => true)
            .catch(error => Observable.of(false));
    }

    updateSurvey(surveyId: number, survey: Survey): Observable<Survey> {
        let surveyPutObject = this.prepareSurveyRequest(survey);
        return this.api.put('surveys/'+surveyId, surveyPutObject)
            .map((res:any) => {
                if(SurveyDataValidator.checkIfSurveyApiResponseIsValid(res)) {
                    return SurveyService.createSurveyObjectFromResponse(res);
                }

                throw new Error('Dobijen je pogrešan odgovor sa servera pri ažuriranju ankete.');
            });
    }

}