import { Injectable } from '@angular/core';
import {ApiService} from "../api/api.service";
import {Survey} from "../../data/survey.data";
import {SurveyDataValidator} from "../../data-validators/survey/survey.data-validator";
import {Observable} from 'rxjs/Rx';

@Injectable()
export class SurveyService {

    constructor(public api: ApiService) { }

    createSurvey(survey: Survey) {
        let newSurvey: Survey = Object.assign({}, survey);
        if(!SurveyDataValidator.checkIfSurveyObjectHasRequiredFields(newSurvey)) {
            return Observable.throw(new Error("Anketa nema definisana sva obavezna polja."));
        }
        delete newSurvey.id;

        return this.api.post('surveys', newSurvey).map((res:any) => {
            if(SurveyDataValidator.checkIfSurveyApiResponseIsValid(res)) {
                return SurveyService.createSurveyObjectFromResponse(res);
            }

            throw new Error('Dobijen je pogrešan odgovor sa servera pri kreiranju ankete.');
        });
    }

    static createSurveyObjectFromResponse(surveyResponse): Survey {
        return Object.assign(
            {}, surveyResponse,
            {
                start: new Date(surveyResponse.start),
                end: new Date(surveyResponse.end)
            }
        );
    }

}