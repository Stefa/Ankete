import {TestBed, inject} from "@angular/core/testing";
import {AnswerService} from "./answer.service";
import {ApiService} from "../api/api.service";
import {MockApiService} from "../api/mock-api.service";
import {
    answerObject, answerPostResponse, answerPostRequest, answerObjectWithUserAnswer,
    answerWithUserAnswerPostResponse, answerWithUserAnswerPostRequest
} from "../../test/answer";
import {Answer} from "../../data/answer.data";

describe('AnswerService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                AnswerService,
                {provide: ApiService, useClass: MockApiService}
            ]
        });
    });
    
    describe('createAnswer', () => {
        it('should send the right answer data to api service post action', inject(
            [ApiService, AnswerService],
            (apiService: MockApiService, answerService: AnswerService) => {
                let newAnswerObject = Object.assign({}, answerObject);
                delete newAnswerObject.id;

                apiService.setResponse(answerPostResponse);
                apiService.init();
                answerService.createAnswer(newAnswerObject).subscribe();

                expect(apiService.post).toHaveBeenCalledWith('answers', answerPostRequest);
            }
        ));

        it('should return answer object if answer was successfully saved to api', inject(
            [ApiService, AnswerService],
            (apiService: MockApiService, answerService: AnswerService) => {
                let newAnswerObject = Object.assign({}, answerObject);
                delete newAnswerObject.id;
                let createdAnswer: Answer = null;
                let expectedReturnAnswer = Object.assign({}, answerObject, {
                    progress: {id: answerObject.progress.id},
                    question: {id: answerObject.question.id},
                });

                apiService.setResponse(answerPostResponse);
                apiService.init();
                answerService.createAnswer(newAnswerObject).subscribe(
                    answer => createdAnswer = answer
                );

                expect(createdAnswer).toEqual(expectedReturnAnswer);
            }
        ));

        it('should send userAnswer property if populated', inject(
            [ApiService, AnswerService],
            (apiService: MockApiService, answerService: AnswerService) => {
                let newAnswerObject = Object.assign({}, answerObjectWithUserAnswer);
                delete newAnswerObject.id;

                apiService.setResponse(answerWithUserAnswerPostResponse);
                apiService.init();
                answerService.createAnswer(newAnswerObject).subscribe();

                expect(apiService.post).toHaveBeenCalledWith('answers', answerWithUserAnswerPostRequest);
            }
        ));
    });
    
    describe('updateAnswers', () => {
        it('should send the right update data to api service patch action', inject(
            [ApiService, AnswerService],
            (apiService: MockApiService, answerService: AnswerService) => {
                let updatedAnswerPostResponse = Object.assign({}, answerPostResponse, {answers: [3]});
                apiService.setResponse(updatedAnswerPostResponse);
                apiService.init();
                answerService.updateAnswers(1, [3]).subscribe();

                expect(apiService.patch).toHaveBeenCalledWith('answers/1', {answers: [3]});
            }
        ));

        it('should return answer object with updated answers field', inject(
            [ApiService, AnswerService],
            (apiService: MockApiService, answerService: AnswerService) => {

                let updatedAnswerPostResponse = Object.assign({}, answerPostResponse, {answers: [3]});
                let updatedAnswer: Answer;
                let expectedAnswer = Object.assign({}, answerObject, {
                    progress: {id: answerObject.progress.id},
                    question: {id: answerObject.question.id},
                    answers: [3]
                });

                apiService.setResponse(updatedAnswerPostResponse);
                apiService.init();
                answerService.updateAnswers(1, [3])
                    .subscribe(answer => updatedAnswer = answer);

                expect(updatedAnswer).toEqual(expectedAnswer);
            }
        ));

        it('should throw appropriate error when answer for update was not found', inject(
            [ApiService, AnswerService],
            (apiService: MockApiService, answerService: AnswerService) => {
                let updatedAnswer: Answer;
                let errorMessage: any;

                let errorResponse: any = {
                    status: 404,
                    message: '404 - Not Found'
                };

                apiService.setError(errorResponse);
                apiService.init();

                answerService.updateAnswers(1, [3]).subscribe(
                    answer => updatedAnswer = answer,
                    error => errorMessage = error.message
                );

                expect(updatedAnswer).toBeUndefined();
                expect(errorMessage).toBe("Traženi odgovor ne postoji.")
            }
        ));
    });
    
    describe('setUserAnswer', () => {
        it('should send the right update data to api service patch action', inject(
            [ApiService, AnswerService],
            (apiService: MockApiService, answerService: AnswerService) => {
                let updatedAnswerPostResponse = Object.assign({}, answerPostResponse, {userAnswer: 'My answer'});
                apiService.setResponse(updatedAnswerPostResponse);
                apiService.init();
                answerService.setUserAnswer(1, 'My answer').subscribe();

                expect(apiService.patch).toHaveBeenCalledWith('answers/1', {userAnswer: 'My answer'});
            }
        ));

        it('should return answer object with updated user answer field', inject(
            [ApiService, AnswerService],
            (apiService: MockApiService, answerService: AnswerService) => {

                let updatedAnswerPostResponse = Object.assign({}, answerPostResponse, {userAnswer: 'My answer'});
                let updatedAnswer: Answer;
                let expectedAnswer = Object.assign({}, answerObject, {
                    progress: {id: answerObject.progress.id},
                    question: {id: answerObject.question.id},
                    userAnswer: 'My answer'
                });

                apiService.setResponse(updatedAnswerPostResponse);
                apiService.init();
                answerService.setUserAnswer(1, 'My answer')
                    .subscribe(answer => updatedAnswer = answer);

                expect(updatedAnswer).toEqual(expectedAnswer);
            }
        ));

        it('should throw appropriate error when answer for update was not found', inject(
            [ApiService, AnswerService],
            (apiService: MockApiService, answerService: AnswerService) => {
                let updatedAnswer: Answer;
                let errorMessage: any;

                let errorResponse: any = {
                    status: 404,
                    message: '404 - Not Found'
                };

                apiService.setError(errorResponse);
                apiService.init();

                answerService.setUserAnswer(1, 'My answer').subscribe(
                    answer => updatedAnswer = answer,
                    error => errorMessage = error.message
                );

                expect(updatedAnswer).toBeUndefined();
                expect(errorMessage).toBe("Traženi odgovor ne postoji.")
            }
        ));
    });

    describe('deleteAnswer', () => {
        it('should send the right answer path to api service', inject(
            [ApiService, AnswerService],
            (apiService: MockApiService, answerService: AnswerService) => {
                apiService.setResponse({});
                apiService.init();
                answerService.deleteAnswer(1).subscribe();

                expect(apiService.delete).toHaveBeenCalledWith('answers/1');
            }
        ));

        it('should return true if answer was successfully deleted', inject(
            [ApiService, AnswerService],
            (apiService: MockApiService, answerService: AnswerService) => {
                let success: boolean;

                apiService.setResponse({});
                apiService.init();
                answerService.deleteAnswer(1).subscribe(deleted => success = deleted);

                expect(success).toBe(true);
            }
        ));

        it('should return false if answer was not found',  inject(
            [ApiService, AnswerService],
            (apiService: MockApiService, answerService: AnswerService) => {
                let success: boolean;
                let errorResponse: any = {
                    status: 404,
                    message: '404 - Not Found'
                };

                apiService.setError(errorResponse);
                apiService.init();

                answerService.deleteAnswer(1).subscribe(deleted => success = deleted);

                expect(success).toBe(false);
            }
        ));
    });
});
