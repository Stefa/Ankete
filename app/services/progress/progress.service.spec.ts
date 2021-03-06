import {TestBed, inject, fakeAsync} from "@angular/core/testing";
import {ProgressService} from "./progress.service";
import {ApiService} from "../api/api.service";
import {MockApiService} from "../api/mock-api.service";
import {
    progressPostResponse, progressObject, progressPostRequest, progressObjectByClerk,
    progressByClerkPostResponse, progressByClerkPostRequest
} from "../../test/progress";
import {Progress} from "../../data/progress.data";
import {leonardoUserObject, leonardoUserResponse} from "../../test/users";
import {userTypes} from "../../data/user.data";
import {AnswerService} from "../answer/answer.service";

describe('ProgressServise', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                ProgressService, AnswerService,
                {provide: ApiService, useClass: MockApiService}
            ]
        });
    });
    
    describe('createProgress', () => {
        it('should send the right progress data to api service post action', inject(
            [ApiService, ProgressService],
            (apiService: MockApiService, progressService: ProgressService) => {
                let newProgressObject = Object.assign({}, progressObject);
                delete newProgressObject.id;

                apiService.setResponse(progressPostResponse);
                apiService.init();
                progressService.createProgress(newProgressObject).subscribe();

                expect(apiService.post).toHaveBeenCalledWith('progress', progressPostRequest);
            }
        ));
        
        it('should return progress object if progress was successfully saved to api', inject(
            [ApiService, ProgressService],
            (apiService: MockApiService, progressService: ProgressService) => {
                let newProgressObject = Object.assign({}, progressObject);
                delete newProgressObject.id;
                let createdProgress: Progress = null;
                let expectedReturnProgress = Object.assign({}, progressObject, {
                    survey: {id: progressObject.survey.id},
                    user: {id: progressObject.user.id},
                });

                apiService.setResponse(progressPostResponse);
                apiService.init();
                progressService.createProgress(newProgressObject).subscribe(
                    progress => createdProgress = progress
                );

                expect(createdProgress).toEqual(expectedReturnProgress);
            }
        ));

        it('should send userData property if populated and user is not of type participant', inject(
            [ApiService, ProgressService],
            (apiService: MockApiService, progressService: ProgressService) => {
                let newProgressObject = Object.assign({}, progressObjectByClerk);
                delete newProgressObject.id;

                apiService.setResponse(progressByClerkPostResponse);
                apiService.init();
                progressService.createProgress(newProgressObject).subscribe();

                expect(apiService.post).toHaveBeenCalledWith('progress', progressByClerkPostRequest);
            }
        ));

        it('should return progress object with userData if progress was successfully saved to api', inject(
            [ApiService, ProgressService],
            (apiService: MockApiService, progressService: ProgressService) => {
                let newProgressObject = Object.assign({}, progressObjectByClerk);
                delete newProgressObject.id;
                let createdProgress: Progress = null;
                let expectedReturnProgress = Object.assign({}, progressObjectByClerk, {
                    survey: {id: progressObject.survey.id},
                    user: {id: progressObject.user.id},
                });

                apiService.setResponse(progressByClerkPostResponse);
                apiService.init();
                progressService.createProgress(newProgressObject).subscribe(
                    progress => createdProgress = progress
                );

                expect(createdProgress).toEqual(expectedReturnProgress);
            }
        ));

        it('should ignore userData property if user is of type participant', inject(
            [ApiService, ProgressService],
            (apiService: MockApiService, progressService: ProgressService) => {
                let newProgressObject = Object.assign({}, progressObjectByClerk);
                delete newProgressObject.id;

                let participantUser = Object.assign({}, leonardoUserObject, {type: userTypes.participant});
                newProgressObject.user = participantUser;

                apiService.setResponse(progressPostResponse);
                apiService.init();
                progressService.createProgress(newProgressObject).subscribe();

                expect(apiService.post).toHaveBeenCalledWith('progress', progressPostRequest);
            }
        ));
    });

    describe('updateProgress', () => {
        it('should send the right update data to api service patch action', inject(
            [ApiService, ProgressService],
            (apiService: MockApiService, progressService: ProgressService) => {
                let updatedProgressPostResponse = Object.assign({}, progressPostResponse, {progress: {done: 1, total: 10}});
                apiService.setResponse(updatedProgressPostResponse);
                apiService.init();
                progressService.updateProgress(1, {done: 1, total: 10}).subscribe();

                expect(apiService.patch).toHaveBeenCalledWith('progress/1', {progress: {done: 1, total: 10}});
            }
        ));

        it('should return progress object with updated progress field', inject(
            [ApiService, ProgressService],
            (apiService: MockApiService, progressService: ProgressService) => {
                let updatedProgressPostResponse = Object.assign({}, progressPostResponse, {progress: {done: 1, total: 10}});
                let updatedProgress: Progress;
                let expectedProgress = Object.assign({}, progressObject, {
                    survey: {id: progressObject.survey.id},
                    user: {id: progressObject.user.id},
                    progress: {done: 1, total: 10}
                });
                apiService.setResponse(updatedProgressPostResponse);
                apiService.init();
                progressService.updateProgress(1, {done: 1, total: 10})
                    .subscribe(progress => updatedProgress = progress);

                expect(updatedProgress).toEqual(expectedProgress);
            }
        ));

        it('should throw appropriate error when progress for update was not found', inject(
            [ApiService, ProgressService],
            (apiService: MockApiService, progressService: ProgressService) => {
                let updatedProgress: Progress;
                let errorMessage: any;

                let errorResponse: any = {
                    status: 404,
                    message: '404 - Not Found'
                };

                apiService.setError(errorResponse);
                apiService.init();

                progressService.updateProgress(1, {done: 1, total: 10}).subscribe(
                    progress => updatedProgress = progress,
                    error => errorMessage = error.message
                );

                expect(updatedProgress).toBeUndefined();
                expect(errorMessage).toBe("Traženi progres ne postoji.")
            }
        ));
    });

    describe('setFinished', () => {
        it('should send the right update data to api service patch action', inject(
            [ApiService, ProgressService],
            (apiService: MockApiService, progressService: ProgressService) => {
                let updatedProgressPostResponse = Object.assign({}, progressPostResponse, {finished: true});
                apiService.setResponse(updatedProgressPostResponse);
                apiService.init();
                progressService.setFinished(1).subscribe();

                expect(apiService.patch).toHaveBeenCalledWith('progress/1', {finished: true});
            }
        ));

        it('should return progress object with updated progress field', inject(
            [ApiService, ProgressService],
            (apiService: MockApiService, progressService: ProgressService) => {
                let updatedProgressPostResponse = Object.assign({}, progressPostResponse, {finished: true});
                let updatedProgress: Progress;
                let expectedProgress = Object.assign({}, progressObject, {
                    survey: {id: progressObject.survey.id},
                    user: {id: progressObject.user.id},
                    finished: true
                });
                apiService.setResponse(updatedProgressPostResponse);
                apiService.init();
                progressService.setFinished(1)
                    .subscribe(progress => updatedProgress = progress);

                expect(updatedProgress).toEqual(expectedProgress);
            }
        ));

        it('should throw appropriate error when progress for update was not found', inject(
            [ApiService, ProgressService],
            (apiService: MockApiService, progressService: ProgressService) => {
                let updatedProgress: Progress;
                let errorMessage: any;

                let errorResponse: any = {
                    status: 404,
                    message: '404 - Not Found'
                };

                apiService.setError(errorResponse);
                apiService.init();

                progressService.setFinished(1).subscribe(
                    progress => updatedProgress = progress,
                    error => errorMessage = error.message
                );

                expect(updatedProgress).toBeUndefined();
                expect(errorMessage).toBe("Traženi progres ne postoji.")
            }
        ));
    });

    describe('deleteProgress', () => {
        it('should send the right progress path to api service', inject(
            [ApiService, ProgressService],
            (apiService: MockApiService, progressService: ProgressService) => {
                apiService.setResponse({});
                apiService.init();
                progressService.deleteProgress(1).subscribe();

                expect(apiService.delete).toHaveBeenCalledWith('progress/1');
            }
        ));

        it('should return true if progress was successfully deleted', inject(
            [ApiService, ProgressService],
            (apiService: MockApiService, progressService: ProgressService) => {
                let success: boolean;

                apiService.setResponse({});
                apiService.init();
                progressService.deleteProgress(1).subscribe(deleted => success = deleted);

                expect(success).toBe(true);
            }
        ));

        it('should return false if progress was not found',  inject(
            [ApiService, ProgressService],
            (apiService: MockApiService, progressService: ProgressService) => {
                let success: boolean;
                let errorResponse: any = {
                    status: 404,
                    message: '404 - Not Found'
                };

                apiService.setError(errorResponse);
                apiService.init();

                progressService.deleteProgress(1).subscribe(deleted => success = deleted);

                expect(success).toBe(false);
            }
        ));
    });

    describe('getProgressWithAnswersBySurveyAndUser', () => {
        let apiResponse = [
            {
                surveyId: 7,
                userId: 1,
                finished: false,
                id: 2,
                progress: {done: 1, total: 4},
                userData: 'anonymous',
                answers: [
                    {
                        progressId: 2,
                        questionId: 1,
                        answers: 1,
                        id: 3
                    }
                ]
            },
            {
                surveyId: 7,
                userId: 1,
                finished: false,
                id: 1,
                progress: {done: 2, total: 4},
                answers: [
                    {
                        progressId: 1,
                        questionId: 1,
                        answers: 1,
                        id: 1
                    },
                    {
                        progressId: 1,
                        questionId: 2,
                        answers: [0,3],
                        id: 2
                    }
                ]
            }
        ];
        let methodResponse = {
            survey: {id: 7},
            user: {id: 1},
            finished: false,
            id: 1,
            progress: {done: 2, total: 4},
            answers: [
                {
                    progress: {id: 1},
                    question: {id: 1},
                    answers: 1,
                    id: 1
                },
                {
                    progress: {id: 1},
                    question: {id: 2},
                    answers: [0,3],
                    id: 2
                }
            ]
        };
        it('should send get request to the right api url', inject(
            [ApiService, ProgressService],
            fakeAsync((apiService: MockApiService, progressService: ProgressService) => {
                apiService.setResponse(apiResponse);
                apiService.init();
                progressService.getProgressWithAnswersBySurveyAndUser(7, 1).subscribe();
                expect(apiService.get).toHaveBeenCalledWith('progress?surveyId=7&userId=1&_embed=answers');
            })
        ));

        it('should return survey object if api returns it', inject(
            [ApiService, ProgressService],
            fakeAsync((apiService: MockApiService, progressService: ProgressService) => {
                let returnedProgress;
                apiService.setResponse(apiResponse);
                apiService.init();
                progressService.getProgressWithAnswersBySurveyAndUser(7, 1).subscribe(
                    progress => returnedProgress = progress
                );

                expect(returnedProgress).toEqual(methodResponse);
            })
        ));

        it('should return error if survey is not found', inject(
            [ApiService, ProgressService],
            fakeAsync((apiService: MockApiService, progressService: ProgressService) => {
                let returnedProgress;
                let errorMessage: any;

                let errorResponse: any = {
                    status: 404,
                    message: '404 - Not Found'
                };

                apiService.setError(errorResponse);
                apiService.init();

                progressService.getProgressWithAnswersBySurveyAndUser(7, 1).subscribe(
                    progress => returnedProgress = progress,
                    error => errorMessage = error.message
                );

                expect(returnedProgress).toBeUndefined();
                expect(errorMessage).toBe('Traženi odgovori ne postoje.');
            })
        ));

    });

    describe('getProgressWithAnswersById', () => {
        let apiResponse = {
            surveyId: 7,
            userId: 1,
            finished: false,
            id: 1,
            progress: {done: 0, total: 2},
            answers: [
                {
                    progressId: 1,
                    questionId: 1,
                    answers: 1,
                    id: 1
                },
                {
                    progressId: 1,
                    questionId: 2,
                    answers: [0,3],
                    id: 2
                }
            ]
        };
        let methodResponse = {
            survey: {id: 7},
            user: {id: 1},
            finished: false,
            id: 1,
            progress: {done: 0, total: 2},
            answers: [
                {
                    progress: {id: 1},
                    question: {id: 1},
                    answers: 1,
                    id: 1
                },
                {
                    progress: {id: 1},
                    question: {id: 2},
                    answers: [0,3],
                    id: 2
                }
            ]
        };
        it('should send get request to the right api url', inject(
            [ApiService, ProgressService],
            fakeAsync((apiService: MockApiService, progressService: ProgressService) => {
                apiService.setResponse(apiResponse);
                apiService.init();
                progressService.getProgressWithAnswersById(1).subscribe();
                expect(apiService.get).toHaveBeenCalledWith('progress/1?_embed=answers');
            })
        ));

        it('should return survey object if api returns it', inject(
            [ApiService, ProgressService],
            fakeAsync((apiService: MockApiService, progressService: ProgressService) => {
                let returnedProgress;
                apiService.setResponse(apiResponse);
                apiService.init();
                progressService.getProgressWithAnswersById(1).subscribe(
                    progress => returnedProgress = progress
                );

                expect(returnedProgress).toEqual(methodResponse);
            })
        ));

        it('should return error if survey is not found', inject(
            [ApiService, ProgressService],
            fakeAsync((apiService: MockApiService, progressService: ProgressService) => {
                let returnedProgress;
                let errorMessage: any;

                let errorResponse: any = {
                    status: 404,
                    message: '404 - Not Found'
                };

                apiService.setError(errorResponse);
                apiService.init();

                progressService.getProgressWithAnswersById(1).subscribe(
                    progress => returnedProgress = progress,
                    error => errorMessage = error.message
                );

                expect(returnedProgress).toBeUndefined();
                expect(errorMessage).toBe('Traženi odgovori ne postoje.');
            })
        ));

    });

    describe('getProgressBySurvey', () => {
        let apiResponse = [
            {
                surveyId: 7,
                userId: 1,
                finished: true,
                id: 1,
                progress: {done: 2, total: 2},
                user: leonardoUserResponse
            },
            {
                surveyId: 7,
                userId: 1,
                finished: true,
                id: 3,
                progress: {done: 2, total: 2},
                user: leonardoUserResponse,
                userData: {
                    name: "Arthur",
                    surname: "Dent",
                    birthday: "1984-03-26T22:00:00.000Z"
                }
            }
        ];

        let methodResponse = [
            {
                survey: {id: 7},
                finished: true,
                id: 1,
                progress: {done: 2, total: 2},
                user: leonardoUserObject
            },
            {
                survey: {id: 7},
                finished: true,
                id: 3,
                progress: {done: 2, total: 2},
                user: leonardoUserObject,
                userData: {
                    name: "Arthur",
                    surname: "Dent",
                    birthday: new Date("1984-03-26T22:00:00.000Z")
                }
            }
        ];

        it('should send get request to progress path with survey filter', inject(
            [ApiService, ProgressService],
            fakeAsync((apiService: MockApiService, progressService: ProgressService) => {
                apiService.setResponse(apiResponse);
                apiService.init();
                progressService.getFinishedProgressBySurvey(7).subscribe();
                expect(apiService.get).toHaveBeenCalledWith('progress?surveyId=7&finished=true&_expand=user');
            })
        ));

        it('should return array of survey objects', inject(
            [ApiService, ProgressService],
            fakeAsync((apiService: MockApiService, progressService: ProgressService) => {
                let result;
                apiService.setResponse(apiResponse);
                apiService.init();
                progressService.getFinishedProgressBySurvey(7).subscribe(progress => result = progress);
                expect(result).toEqual(methodResponse);
            })
        ));
    });
});
