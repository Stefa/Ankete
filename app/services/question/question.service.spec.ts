import {TestBed, inject} from "@angular/core/testing";
import {QuestionService} from "./question.service";
import {ApiService} from "../api/api.service";
import {MockApiService} from "../api/mock-api.service";
import {Question} from "../../data/question.data";
import {
    newChooseOneQuestion, questionPostRequest, questionPostResponse, expectedCreateQuestionResponse,
    newNumericQuestion, newTextQuestion, newChooseMultipleQuestion, newQuestionForSurvey, questionForSurveyPostResponse,
    questionForSurveyPostRequest, expectedCreateQuestionForSurveyResponse
} from "../../test/questions";

describe('QuestionService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                QuestionService,
                {provide: ApiService, useClass: MockApiService}
            ]
        });
    });

    describe('createQuestion', () => {
        let errorMessage: string;

        function postInvalidQuestion(apiService: MockApiService, questionService: QuestionService, invalidObject: Question, message: string) {
            apiService.init();

            try{
                questionService.createQuestion(invalidObject).subscribe();
            } catch (e) {errorMessage = e.message;}

            expect(errorMessage).toEqual(message);
            expect(apiService.post).not.toHaveBeenCalled();
        }

        it('should send the right question data to api service provided the valid question object', inject(
            [ApiService, QuestionService],
            (apiService: MockApiService, questionService: QuestionService) => {
                apiService.setResponse(questionPostResponse);
                apiService.init();
                questionService.createQuestion(newChooseOneQuestion).subscribe();

                expect(apiService.post).toHaveBeenCalledWith('questions', questionPostRequest);
            }
        ));

        it('should return question object with populated id and author fields', inject(
            [ApiService, QuestionService],
            (apiService: MockApiService, questionService: QuestionService) => {
                let createdQuestion: Question;

                apiService.setResponse(questionPostResponse);
                apiService.init();
                questionService.createQuestion(newChooseOneQuestion).subscribe((res: Question) => createdQuestion = res);

                expect(createdQuestion).toEqual(expectedCreateQuestionResponse);
            }
        ));

        it('should send surveyId field to api service if survey field is provided in question object', inject(
            [ApiService, QuestionService],
            (apiService: MockApiService, questionService: QuestionService) => {
                let questionToCreate = Object.assign({}, newQuestionForSurvey);

                apiService.setResponse(questionForSurveyPostResponse);
                apiService.init();
                questionService.createQuestion(questionToCreate).subscribe();

                expect(apiService.post).toHaveBeenCalledWith('questions', questionForSurveyPostRequest);
            }
        ));

        it('should return question object with populated survey field if surveyId is present in api response', inject(
            [ApiService, QuestionService],
            (apiService: MockApiService, questionService: QuestionService) => {
                let questionToCreate = Object.assign({}, newQuestionForSurvey);
                let createdQuestion: Question = null;

                apiService.setResponse(questionForSurveyPostResponse);
                apiService.init();
                questionService.createQuestion(questionToCreate).subscribe((res: Question) => createdQuestion = res);

                expect(createdQuestion).toEqual(expectedCreateQuestionForSurveyResponse);
            }
        ));

        it('should throw an error if the text is not set', inject(
            [ApiService, QuestionService],
            (apiService: MockApiService, questionService: QuestionService) => {
                let questionWithEmptyText = Object.assign({}, newChooseOneQuestion);
                questionWithEmptyText.text = '';
                let message = 'Tekst pitanja mora biti zadat.';

                postInvalidQuestion(apiService, questionService, questionWithEmptyText, message);
            }
        ));

        it('should throw an error if type is numeric and answerLabels property is empty', inject(
            [ApiService, QuestionService],
            (apiService: MockApiService, questionService: QuestionService) => {
                let numericQuestionWithNoAnswers = Object.assign({}, newNumericQuestion);
                numericQuestionWithNoAnswers.answerLabels = [];
                let message = 'Tekst bar jednog polja za odgovor mora biti postavljen.';

                postInvalidQuestion(apiService, questionService, numericQuestionWithNoAnswers, message);
            }
        ));

        it('should throw an error if type is text and answerLabels property is empty', inject(
            [ApiService, QuestionService],
            (apiService: MockApiService, questionService: QuestionService) => {
                let textQuestionWithNoAnswers = Object.assign({}, newTextQuestion);
                textQuestionWithNoAnswers.answerLabels = [];
                let message = 'Tekst bar jednog polja za odgovor mora biti postavljen.';

                postInvalidQuestion(apiService, questionService, textQuestionWithNoAnswers, message);
            }
        ));

        it('should throw an error if type is choose_one and length of answerLabels property is less than two', inject(
            [ApiService, QuestionService],
            (apiService: MockApiService, questionService: QuestionService) => {
                let chooseOneQuestionWithOneAnswers = Object.assign({}, newChooseOneQuestion);
                chooseOneQuestionWithOneAnswers.answerLabels = ['Leonardo'];
                let message = 'Pitanje mora imati više ponuđenih odgovora.';

                postInvalidQuestion(apiService, questionService, chooseOneQuestionWithOneAnswers, message);
            }
        ));

        it('should throw an error if type is choose_multiple and length of answerLabels property is less than two', inject(
            [ApiService, QuestionService],
            (apiService: MockApiService, questionService: QuestionService) => {
                let chooseMultipleQuestionWithOneAnswers = Object.assign({}, newChooseMultipleQuestion);
                chooseMultipleQuestionWithOneAnswers.answerLabels = ['Leonardo'];
                let message = 'Pitanje mora imati više ponuđenih odgovora.';

                postInvalidQuestion(apiService, questionService, chooseMultipleQuestionWithOneAnswers, message);
            }
        ));

        it('should throw an error if user is not set', inject(
            [ApiService, QuestionService],
            (apiService: MockApiService, questionService: QuestionService) => {
                let chooseOneQuestionWithoutAuthor = Object.assign({}, newChooseOneQuestion);
                chooseOneQuestionWithoutAuthor.author = null;
                let message = 'Autor pitanja mora biti postavljen.';

                postInvalidQuestion(apiService, questionService, chooseOneQuestionWithoutAuthor, message);
            }
        ));
    });

    describe('updateSurveyId', () => {
        it('should send the right update data to api service patch action', inject(
            [ApiService, QuestionService],
            (apiService: MockApiService, questionService: QuestionService) => {
                apiService.setResponse(questionForSurveyPostResponse);
                apiService.init();
                questionService.updateSurveyId(1, 1).subscribe();

                expect(apiService.patch).toHaveBeenCalledWith('questions/1', {surveyId: 1});
            }
        ));

        it('should return question object with populated survey and author', inject(
            [ApiService, QuestionService],
            (apiService: MockApiService, questionService: QuestionService) => {
                let updatedQuestion: Question;
                apiService.setResponse(questionForSurveyPostResponse);
                apiService.init();
                questionService.updateSurveyId(1, 1).subscribe(question => updatedQuestion = question);

                expect(updatedQuestion).toEqual(expectedCreateQuestionForSurveyResponse);
            }
        ));

        it('should throw appropriate error when question for update was not found', inject(
            [ApiService, QuestionService],
            (apiService: MockApiService, questionService: QuestionService) => {
                let updatedQuestion: Question;
                let errorMessage: any;

                let errorResponse: any = {
                    status: 404,
                    message: '404 - Not Found'
                };

                apiService.setError(errorResponse);
                apiService.init();

                questionService.updateSurveyId(1, 1).subscribe(
                    question => updatedQuestion = question,
                    error => errorMessage = error.message
                );

                expect(updatedQuestion).toBeUndefined();
                expect(errorMessage).toBe("Traženo pitanje ne postoji.")
            }
        ));
    });

    describe('deleteQuestion', () => {
        it('should send the right question path to api service', inject(
            [ApiService, QuestionService],
            (apiService: MockApiService, questionService: QuestionService) => {
                apiService.setResponse({});
                apiService.init();
                questionService.deleteQuestion(1).subscribe();

                expect(apiService.delete).toHaveBeenCalledWith('questions/1');
            }
        ));

        it('should return true if question was successfully deleted', inject(
            [ApiService, QuestionService],
            (apiService: MockApiService, questionService: QuestionService) => {
                let success: boolean;

                apiService.setResponse({});
                apiService.init();
                questionService.deleteQuestion(1).subscribe(deleted => success = deleted);

                expect(success).toBe(true);
            }
        ));

        it('should return false if question was not found',  inject(
            [ApiService, QuestionService],
            (apiService: MockApiService, questionService: QuestionService) => {
                let success: boolean;
                let errorResponse: any = {
                    status: 404,
                    message: '404 - Not Found'
                };

                apiService.setError(errorResponse);
                apiService.init();

                questionService.deleteQuestion(1).subscribe(deleted => success = deleted);

                expect(success).toBe(false);
            }
        ));
    });
});
