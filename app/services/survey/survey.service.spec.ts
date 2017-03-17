import {TestBed, inject, fakeAsync, tick} from "@angular/core/testing";
import {SurveyService} from "./survey.service";
import {ApiService} from "../api/api.service";
import {MockApiService} from "../api/mock-api.service";
import {Survey} from "../../data/survey.data";
import {newTestSurvey, newTestSurveyResponse} from "../../test/surveys";

describe('SurveyService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                SurveyService,
                {
                    provide: ApiService,
                    useClass: MockApiService
                }
            ]
        });
    });
    
    describe('createSurvey', () => {
        it('should send the post request to the api if survey data is correct', inject(
            [ApiService, SurveyService],
            fakeAsync((apiService: MockApiService, surveyService: SurveyService) => {
                let newSurvey: Survey = Object.assign({}, newTestSurvey);
                delete newSurvey.id;
                let expectedSurveyRequest = Object.assign({userId: newSurvey.author.id}, newSurvey);
                delete expectedSurveyRequest.author;
                let newSurveyResponse = Object.assign({}, newTestSurveyResponse);

                apiService.setResponse(newSurveyResponse);
                apiService.init();
                surveyService.createSurvey(newSurvey).subscribe(
                    survey => {},
                    error => {}
                );
                tick();
                expect(apiService.post).toHaveBeenCalledWith('surveys', expectedSurveyRequest);
            })
        ));

        it('should send the survey object without id property to the api', inject(
            [ApiService, SurveyService],
            fakeAsync((apiService: MockApiService, surveyService: SurveyService) => {
                let newSurvey: Survey = Object.assign({}, newTestSurvey);
                let expectedSurveyRequest = Object.assign({userId: newSurvey.author.id}, newTestSurvey);
                delete expectedSurveyRequest.id;
                delete expectedSurveyRequest.author;
                let newSurveyResponse = Object.assign({}, newTestSurveyResponse);

                apiService.setResponse(newSurveyResponse);
                apiService.init();
                surveyService.createSurvey(newSurvey).subscribe(
                    survey => {},
                    error => {}
                );
                tick();
                expect(apiService.post).toHaveBeenCalledWith('surveys', expectedSurveyRequest);
            })
        ));

        it('should return Observable of Survey object when api returns created survey', inject(
            [ApiService, SurveyService],
            fakeAsync((apiService: MockApiService, surveyService: SurveyService) => {
                let newSurvey: Survey = Object.assign({}, newTestSurvey);
                delete newSurvey.id;
                let newSurveyResponse = Object.assign({}, newTestSurveyResponse);
                let expectedSurvey: Survey = Object.assign({}, newTestSurvey);
                expectedSurvey.author = {id: newTestSurvey.author.id};
                let createdSurvey: Survey = null;

                apiService.setResponse(newSurveyResponse);
                apiService.init();
                surveyService.createSurvey(newSurvey).subscribe(
                    survey => createdSurvey = survey,
                    error => {}
                );
                tick();
                expect(createdSurvey).toEqual(expectedSurvey);
            })
        ));

        it('should throw error if invalid survey is provided', inject(
            [ApiService, SurveyService],
            fakeAsync((apiService: MockApiService, surveyService: SurveyService) => {
                let newSurvey: Survey = Object.assign({}, newTestSurvey);
                delete newSurvey.name;
                let errorMessage = '';

                apiService.setResponse(null);
                apiService.init();
                surveyService.createSurvey(newSurvey).subscribe(
                    survey => {},
                    error => errorMessage = error.message
                );
                tick();
                expect(apiService.post).not.toHaveBeenCalled();
                expect(errorMessage).toBe("Anketa nema definisana sva obavezna polja.");
            })
        ));

        it('should throw error if api response was invalid', inject(
            [ApiService, SurveyService],
            fakeAsync((apiService: MockApiService, surveyService: SurveyService) => {
                let newSurvey: Survey = Object.assign({}, newTestSurvey);
                delete newSurvey.id;
                let errorMessage = '';
                let createdSurvey;

                apiService.setResponse(null);
                apiService.init();
                surveyService.createSurvey(newSurvey).subscribe(
                    survey => createdSurvey = survey,
                    error => errorMessage = error.message
                );
                tick();
                expect(createdSurvey).not.toBeDefined();
                expect(errorMessage).toContain("Dobijen je pogrešan odgovor sa servera pri kreiranju ankete.");
            })
        ));
    });

    describe('blockSurvey', () => {
        it('should send the right update data to api service patch action', inject(
            [ApiService, SurveyService],
            (apiService: MockApiService, surveyService: SurveyService) => {
                let updatedSurveyPostResponse = Object.assign({}, newTestSurvey, {blocked: true});
                apiService.setResponse(updatedSurveyPostResponse);
                apiService.init();
                surveyService.blockSurvey(1).subscribe();

                expect(apiService.patch).toHaveBeenCalledWith('surveys/1', {blocked: true});
            }
        ));

        it('should return survey object with updated blocked field', inject(
            [ApiService, SurveyService],
            (apiService: MockApiService, surveyService: SurveyService) => {
                let updatedSurveyPostResponse = Object.assign({}, newTestSurvey, {
                    userId: newTestSurvey.author.id, blocked: true
                });
                delete updatedSurveyPostResponse.author;
                let updatedSurvey: Survey;
                let expectedSurvey = Object.assign({}, newTestSurvey, {
                    author: {id: newTestSurvey.author.id},
                    blocked: true
                });
                apiService.setResponse(updatedSurveyPostResponse);
                apiService.init();
                surveyService.blockSurvey(1)
                    .subscribe(survey => updatedSurvey = survey);

                expect(updatedSurvey).toEqual(expectedSurvey);
            }
        ));

        it('should throw appropriate error when survey was not found', inject(
            [ApiService, SurveyService],
            (apiService: MockApiService, surveyService: SurveyService) => {
                let updatedSurvey: Survey;
                let errorMessage: any;

                let errorResponse: any = {
                    status: 404,
                    message: '404 - Not Found'
                };

                apiService.setError(errorResponse);
                apiService.init();

                surveyService.blockSurvey(1).subscribe(
                    survey => updatedSurvey = survey,
                    error => errorMessage = error.message
                );

                expect(updatedSurvey).toBeUndefined();
                expect(errorMessage).toBe("Tražena anketa ne postoji.")
            }
        ));
    });
});
