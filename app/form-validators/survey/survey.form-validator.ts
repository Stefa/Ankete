import { Injectable } from '@angular/core';
import {FormGroup} from "@angular/forms";

@Injectable()
export class SurveyFormValidator {

    constructor() { }

    validateForm(surveyFormGroup: FormGroup) {
        if (!surveyFormGroup) { return; }
        let formErrors = {
            'name': [],
            'start': [],
            'end': []
        };

        for (const field in formErrors) {
            if(!formErrors.hasOwnProperty(field)) continue;
            const control = surveyFormGroup.get(field);

            if(!control || !control.dirty || control.valid) continue;

            const messages = this.formControlsValidationMessages[field];
            for (const errorType in control.errors) {
                formErrors[field].push(messages[errorType]);
            }
        }

        for (const errorType in surveyFormGroup.errors) {
            const errors = this.formGroupValidationMessages[errorType];
            for (const field in errors) {
                if(!errors.hasOwnProperty(field)) continue;
                formErrors[field].push(errors[field]);
            }
        }

        return formErrors;
    }

    formControlsValidationMessages = {
        name: {
            required: {css: "survey-name-required", message: "Unesite naziv ankete."}
        },
        start: {
            required: {css: "survey-start-required", message: "Unesite datum početka ankete."}
        },
        end: {
            required: {css: "survey-end-required", message: "Unesite datum kraja ankete."}
        }
    };

    formGroupValidationMessages = {
        startAfterEnd: {
            end: {css: "survey-start-after-end", message: "Kraj ankete ne može biti pre početka."}
        },
        muchPages: {
            pages: {css: "user-pages", message: "Broj strana ne može biti veći od broja pitanja."}
        }
    };

}

