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

        it('should return false if provided survey object is null', () => {
            let valid = SurveyDataValidator.checkIfSurveyObjectHasRequiredFields(null);
            expect(valid).toBe(false);
        });

        it('should return false if name field is missing', () => {
            delete testSurvey.name;
            let valid = SurveyDataValidator.checkIfSurveyObjectHasRequiredFields(testSurvey);
            expect(valid).toBe(false);
        });

        it('should return false if start field is missing', () => {
            delete testSurvey.start;
            let valid = SurveyDataValidator.checkIfSurveyObjectHasRequiredFields(testSurvey);
            expect(valid).toBe(false);
        });
        it('should return false if end field is missing', () => {
            delete testSurvey.end;
            let valid = SurveyDataValidator.checkIfSurveyObjectHasRequiredFields(testSurvey);
            expect(valid).toBe(false);
        });
        it('should return false if anonymous field is missing', () => {
            delete testSurvey.anonymous;
            let valid = SurveyDataValidator.checkIfSurveyObjectHasRequiredFields(testSurvey);
            expect(valid).toBe(false);
        });
        it('should return false if pages field is missing', () => {
            delete testSurvey.pages;
            let valid = SurveyDataValidator.checkIfSurveyObjectHasRequiredFields(testSurvey);
            expect(valid).toBe(false);
        });
        it('should return false if author field is missing', () => {
            delete testSurvey.author;
            let valid = SurveyDataValidator.checkIfSurveyObjectHasRequiredFields(testSurvey);
            expect(valid).toBe(false);
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

        it('should return false if id is missing from survey object', () => {
            delete testSurvey.id;
            let valid = SurveyDataValidator.checkIfSurveyObjectHasAllFields(testSurvey);
            expect(valid).toBe(false);
        });

        it('should return false if name field is missing', () => {
            delete testSurvey.name;
            let valid = SurveyDataValidator.checkIfSurveyObjectHasAllFields(testSurvey);
            expect(valid).toBe(false);
        });

        it('should return false if start field is missing', () => {
            delete testSurvey.start;
            let valid = SurveyDataValidator.checkIfSurveyObjectHasAllFields(testSurvey);
            expect(valid).toBe(false);
        });
        it('should return false if end field is missing', () => {
            delete testSurvey.end;
            let valid = SurveyDataValidator.checkIfSurveyObjectHasAllFields(testSurvey);
            expect(valid).toBe(false);
        });
        it('should return false if anonymous field is missing', () => {
            delete testSurvey.anonymous;
            let valid = SurveyDataValidator.checkIfSurveyObjectHasAllFields(testSurvey);
            expect(valid).toBe(false);
        });
        it('should return false if pages field is missing', () => {
            delete testSurvey.pages;
            let valid = SurveyDataValidator.checkIfSurveyObjectHasAllFields(testSurvey);
            expect(valid).toBe(false);
        });
        it('should return false if author field is missing', () => {
            delete testSurvey.author;
            let valid = SurveyDataValidator.checkIfSurveyObjectHasAllFields(testSurvey);
            expect(valid).toBe(false);
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

        it('should call checkIfSurveyObjectHasAllFields with provided survey response', () => {
            spyOn(SurveyDataValidator, 'checkIfSurveyObjectHasAllFields').and.returnValue(true);

            SurveyDataValidator.checkIfSurveyApiResponseIsValid(testSurveyResponse);
            expect(SurveyDataValidator.checkIfSurveyObjectHasAllFields).toHaveBeenCalledWith(testSurveyResponse);
        });

        it('should return false if any of the fields is missing', () => {
            spyOn(SurveyDataValidator, 'checkIfSurveyObjectHasAllFields').and.returnValue(false);

            let valid = SurveyDataValidator.checkIfSurveyApiResponseIsValid(testSurveyResponse);
            expect(valid).toBe(false);
        });

        it('should return false if start is not valid date string', () => {
            testSurveyResponse.start = 'not a date';
            spyOn(SurveyDataValidator, 'checkIfSurveyObjectHasAllFields').and.returnValue(true);

            let valid = SurveyDataValidator.checkIfSurveyApiResponseIsValid(testSurveyResponse);
            expect(valid).toBe(false);
        });

        it('should return false if end is not valid date string', () => {
            testSurveyResponse.end = 'not a date';
            spyOn(SurveyDataValidator, 'checkIfSurveyObjectHasAllFields').and.returnValue(true);

            let valid = SurveyDataValidator.checkIfSurveyApiResponseIsValid(testSurveyResponse);
            expect(valid).toBe(false);
        });
    });
});