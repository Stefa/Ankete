import {newTestSurvey, newTestSurveyResponse} from "../../test/surveys";
import {SurveyDataValidator} from "./survey.data-validator";

describe('SurveyDataValidator', () => {
    let testSurvey;
    beforeEach(() => {
        testSurvey = Object.assign({}, newTestSurvey);
    });
    
    describe('checkIfSurveyObjectHasRequiredFields', () => {
        it('should return true if survey object has all fields', () => {
            let valid = SurveyDataValidator.checkIfSurveyObjectHasRequiredFields(testSurvey);
            expect(valid).toBe(true);
        });

        it('should return true if only id is missing from survey object', () => {
            delete testSurvey.id;
            let valid = SurveyDataValidator.checkIfSurveyObjectHasRequiredFields(testSurvey);
            expect(valid).toBe(true);
        });

        it('should return true if only questionOrder is missing from survey object', () => {
            delete testSurvey.questionOrder;
            let valid = SurveyDataValidator.checkIfSurveyObjectHasRequiredFields(testSurvey);
            expect(valid).toBe(true);
        });

        it('should return false if provided survey object is null', () => {
            let valid = SurveyDataValidator.checkIfSurveyObjectHasRequiredFields(null);
            expect(valid).toBe(false);
        });

        ['name', 'start', 'end', 'anonymous', 'pages', 'author'].forEach(field => {
            it(`should return false if ${field} is missing`, () => {
                delete testSurvey[field];
                let valid = SurveyDataValidator.checkIfSurveyObjectHasRequiredFields(testSurvey);
                expect(valid).toBe(false);
            });
        });
    });
    
    describe('checkIfSurveyObjectHasAllFields', () => {
        it('should return true if survey object has all fields', () => {
            let valid = SurveyDataValidator.checkIfSurveyObjectHasAllFields(testSurvey);
            expect(valid).toBe(true);
        });

        it('should return false if provided survey object is null', () => {
            let valid = SurveyDataValidator.checkIfSurveyObjectHasAllFields(null);
            expect(valid).toBe(false);
        });

        ['id', 'name', 'start', 'end', 'anonymous', 'pages', 'author', 'questionOrder'].forEach(field => {
            it(`should return false if ${field} is missing from survey object`, () => {
                delete testSurvey[field];
                let valid = SurveyDataValidator.checkIfSurveyObjectHasAllFields(testSurvey);
                expect(valid).toBe(false);
            });
        });
    });

    describe('checkIfSurveyApiResponseIsValid', () => {
        let testSurveyResponse;
        beforeEach(() => {
            testSurveyResponse = Object.assign({}, newTestSurveyResponse);
        });

        it('should return true provided the valid survey response', () => {
            let valid = SurveyDataValidator.checkIfSurveyApiResponseIsValid(testSurveyResponse);
            expect(valid).toBe(true);
        });

        it('should return false if provided response is null', () => {
            let valid = SurveyDataValidator.checkIfSurveyApiResponseIsValid(null);
            expect(valid).toBe(false);
        });

        it('should return true if only questionOrder is missing from survey api response', () => {
            delete testSurveyResponse.questionOrder;
            let valid = SurveyDataValidator.checkIfSurveyApiResponseIsValid(testSurveyResponse);
            expect(valid).toBe(true);
        });

        ['id', 'name', 'start', 'end', 'anonymous', 'pages', 'userId'].forEach(field => {
            it(`should return false if ${field} is missing from survey api response`, () => {
                delete testSurveyResponse[field];
                let valid = SurveyDataValidator.checkIfSurveyApiResponseIsValid(testSurveyResponse);
                expect(valid).toBe(false);
            });
        });

        it('should return false if start is not valid date string', () => {
            testSurveyResponse.start = 'not a date';
            let valid = SurveyDataValidator.checkIfSurveyApiResponseIsValid(testSurveyResponse);
            expect(valid).toBe(false);
        });

        it('should return false if end is not valid date string', () => {
            testSurveyResponse.end = 'not a date';
            let valid = SurveyDataValidator.checkIfSurveyApiResponseIsValid(testSurveyResponse);
            expect(valid).toBe(false);
        });

        it('should return false if survey api response has invalid field', () => {
            testSurveyResponse.progress = [4,10];
            let valid = SurveyDataValidator.checkIfSurveyApiResponseIsValid(testSurveyResponse);
            expect(valid).toBe(false);
        });
    });
});