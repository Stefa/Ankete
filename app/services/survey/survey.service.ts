import { Injectable } from '@angular/core';
import {ApiService} from "../api/api.service";
import {Survey} from "../../data/survey.data";
import {SurveyDataValidator} from "../../data-validators/survey/survey.data-validator";
import {Observable} from 'rxjs/Rx';

@Injectable()
export class SurveyService {

    constructor(public api: ApiService) { }

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
        delete createdSurvey.userId;
        return createdSurvey
    }

}