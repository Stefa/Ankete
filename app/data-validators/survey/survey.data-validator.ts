import {Injectable} from '@angular/core';

@Injectable()
export class SurveyDataValidator {

    static readonly requiredProperties = ['name', 'start', 'end', 'anonymous', 'pages', 'author'];
    static readonly optionalProperties = ['id'];
    static readonly allProperties = SurveyDataValidator.requiredProperties.concat(SurveyDataValidator.optionalProperties);

    static checkIfSurveyObjectHasRequiredFields(survey):boolean {
        if(survey == null) return false;
        return SurveyDataValidator.requiredProperties.every(field => field in survey);
    }

    static checkIfSurveyObjectHasAllFields(survey):boolean {
        if(survey == null) return false;
        return SurveyDataValidator.optionalProperties.every(field => field in survey)
            && SurveyDataValidator.checkIfSurveyObjectHasRequiredFields(survey);
    }

    static checkIfSurveyApiResponseIsValid(survey): boolean {
        if(survey == null) return false;
        if(!SurveyDataValidator.checkIfSurveyObjectHasAllFields(survey)) return false;
        if(isNaN(Date.parse(survey.start))) return false;
        if(isNaN(Date.parse(survey.end))) return false;

        let objectProperties = Object.keys(survey);

        return SurveyDataValidator.allProperties.sort().join() == objectProperties.sort().join();
    }

    static isValidSurveyProperty(property: string) {
        return SurveyDataValidator.allProperties.indexOf(property) === -1;
    }
}