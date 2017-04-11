import {TestBed, inject, fakeAsync, tick} from "@angular/core/testing";
import {SurveyService} from "./survey.service";
import {ApiService} from "../api/api.service";
import {MockApiService} from "../api/mock-api.service";
import {Survey} from "../../data/survey.data";
import {newTestSurvey, newTestSurveyResponse} from "../../test/surveys";
import {questionTypes} from "../../data/question.data";
import {QuestionService} from "../question/question.service";

describe('SurveyService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                SurveyService, QuestionService,
                {
                    provide: ApiService,
                    useClass: MockApiService
                }
            ]
        });
    });

    describe('getSurvey', () => {
        it('should send get request to the right api url', inject(
            [ApiService, SurveyService],
            fakeAsync((apiService: MockApiService, surveyService: SurveyService) => {
                let newSurveyResponse = Object.assign({}, newTestSurveyResponse);
                apiService.setResponse(newSurveyResponse);
                apiService.init();
                surveyService.getSurvey(1).subscribe();
                expect(apiService.get).toHaveBeenCalledWith('surveys/1');
            })
        ));

        it('should return survey object if api returns it', inject(
            [ApiService, SurveyService],
            fakeAsync((apiService: MockApiService, surveyService: SurveyService) => {
                let returnedSurvey;
                let newSurveyResponse = Object.assign({}, newTestSurveyResponse);
                let expectedSurvey: Survey = Object.assign({}, newTestSurvey);
                expectedSurvey.author = {id: newTestSurvey.author.id};

                apiService.setResponse(newSurveyResponse);
                apiService.init();
                surveyService.getSurvey(1).subscribe(
                    survey => returnedSurvey = survey
                );
                expect(returnedSurvey).toEqual(expectedSurvey);
            })
        ));

        it('should return error if survey is not found', inject(
            [ApiService, SurveyService],
            fakeAsync((apiService: MockApiService, surveyService: SurveyService) => {
                let returnedSurvey;
                let errorMessage: any;

                let errorResponse: any = {
                    status: 404,
                    message: '404 - Not Found'
                };

                apiService.setError(errorResponse);
                apiService.init();

                surveyService.getSurvey(1).subscribe(
                    survey => returnedSurvey = survey,
                    error => errorMessage = error.message
                );

                expect(returnedSurvey).toBeUndefined();
                expect(errorMessage).toBe('Tražena anketa ne postoji.');
            })
        ));

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

    describe('getFullSurvey', () => {
        let apiResponse = {
            name: "Survey1",
            start: "2017-03-16T23:00:00.000Z",
            end: "2017-04-20T21:59:59.000Z",
            anonymous: false,
            pages: "1",
            userId: 1,
            questionOrder: [2, 1],
            id: 1,
            questions: [
                {
                    userId: 1,
                    type: questionTypes.choose_one,
                    text: "Question1",
                    required: true,
                    surveyId: 1,
                    answerLabels: ["answer1", "answer2"],
                    id: 1
                },
                {
                    userId: 1,
                    type: questionTypes.choose_multiple,
                    text: "Question2",
                    required: false,
                    surveyId: 1,
                    answerLabels: ["answer1", "answer2", "answer3"],
                    id: 2
                }
            ]
        };
        let methodResponse =  {
            name: "Survey1",
            start: new Date("2017-03-16T23:00:00.000Z"),
            end: new Date("2017-04-20T21:59:59.000Z"),
            anonymous: false,
            pages: "1",
            author: {"id": 1},
            questionOrder: [2, 1],
            id: 1,
            questions: [
                {
                    author: {id: 1},
                    type: questionTypes.choose_multiple,
                    text: "Question2",
                    required: false,
                    survey: {id: 1},
                    answerLabels: ["answer1", "answer2", "answer3"],
                    id: 2
                },
                {
                    author: {id: 1},
                    type: questionTypes.choose_one,
                    text: "Question1",
                    required: true,
                    survey: {id: 1},
                    answerLabels: ["answer1", "answer2"],
                    id: 1
                }
            ]
        };
        it('should send get request to the right api url', inject(
            [ApiService, SurveyService],
            fakeAsync((apiService: MockApiService, surveyService: SurveyService) => {
                apiService.setResponse(apiResponse);
                apiService.init();
                surveyService.getFullSurvey(1).subscribe();
                expect(apiService.get).toHaveBeenCalledWith('surveys/1?_embed=questions&_expand=user');
            })
        ));

        it('should return survey object if api returns it', inject(
            [ApiService, SurveyService],
            fakeAsync((apiService: MockApiService, surveyService: SurveyService) => {
                let returnedSurvey;
                apiService.setResponse(apiResponse);
                apiService.init();
                surveyService.getFullSurvey(1).subscribe(
                    survey => returnedSurvey = survey
                );

                expect(returnedSurvey).toEqual(methodResponse);
            })
        ));

        it('should return error if survey is not found', inject(
            [ApiService, SurveyService],
            fakeAsync((apiService: MockApiService, surveyService: SurveyService) => {
                let returnedSurvey;
                let errorMessage: any;

                let errorResponse: any = {
                    status: 404,
                    message: '404 - Not Found'
                };

                apiService.setError(errorResponse);
                apiService.init();

                surveyService.getFullSurvey(1).subscribe(
                    survey => returnedSurvey = survey,
                    error => errorMessage = error.message
                );

                expect(returnedSurvey).toBeUndefined();
                expect(errorMessage).toBe('Tražena anketa ne postoji.');
            })
        ));

    });

    let surveyResponse1 = {
        name: "Survey 1",
        start: "2017-03-16T23:00:00.000Z",
        end: "2017-04-20T21:59:59.000Z",
        anonymous: false,
        pages: 1,
        userId: 1,
        questionOrder: [56, 57],
        id: 7
    };
    let surveyResponse2 = {
        name: "Survey 2",
        start: "2017-04-16T23:00:00.000Z",
        end: "2017-05-20T21:59:59.000Z",
        anonymous: true,
        pages: 2,
        userId: 1,
        questionOrder: [25, 26, 27],
        id: 9
    };
    let surveyResponse3 = {
        name: "Survey 3",
        start: "2017-06-16T23:00:00.000Z",
        end: "2017-07-20T21:59:59.000Z",
        anonymous: false,
        pages: 3,
        userId: 1,
        questionOrder: [5, 6, 7, 8, 9],
        id: 6,
        blocked: true
    };
    let surveysApiResponse = [surveyResponse1, surveyResponse2, surveyResponse3];
    let surveysResponse = [surveyResponse1, surveyResponse2].map(survey => {
        let surveyCopy = $.extend(true, {}, survey);
        surveyCopy.start = new Date(survey.start);
        surveyCopy.end = new Date(survey.end);
        surveyCopy.author = {id: survey.userId};
        delete surveyCopy.userId;
        return surveyCopy;
    });

    describe('getSurveys', () => {
        it('should send get request to right api url', inject(
            [ApiService, SurveyService],
            fakeAsync((apiService: MockApiService, surveyService: SurveyService) => {
                let returnValue;
                apiService.setResponse(surveysApiResponse);
                apiService.init();
                surveyService.getSurveys().subscribe(
                    surveys => returnValue = surveys
                );
                expect(apiService.get).toHaveBeenCalledWith('surveys');
                expect(returnValue).toEqual(surveysResponse);
            })
        ));
    });

    describe('getUserSurveys', () => {
        it('should send get request to right api url', inject(
            [ApiService, SurveyService],
            fakeAsync((apiService: MockApiService, surveyService: SurveyService) => {
                let returnValue;
                apiService.setResponse(surveysApiResponse);
                apiService.init();
                surveyService.getUserSurveys(1).subscribe(
                    surveys => returnValue = surveys
                );
                expect(apiService.get).toHaveBeenCalledWith('surveys?userId=1');
                expect(returnValue).toEqual(surveysResponse);
            })
        ));
    });
});
