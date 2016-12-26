import {TestBed, inject} from "@angular/core/testing";
import {QuestionService} from "./question.service";
import {ApiService} from "../api/api.service";
import {MockApiService} from "../api/mock-api.service";
import {Question} from "../../data/question.data";
import {
    newChooseOneQuestion, questionPostRequest, questionPostResponse, questionApiResponse,
    newNumericQuestion, newTextQuestion, newChooseMultipleQuestion
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

        it('will send the right question data to api provided the valid question object', inject(
            [ApiService, QuestionService],
            (apiService: MockApiService, questionService: QuestionService) => {
                apiService.setResponse(questionPostResponse);
                apiService.init();
                questionService.createQuestion(newChooseOneQuestion).subscribe();

                expect(apiService.post).toHaveBeenCalledWith('questions', questionPostRequest);
            }
        ));

        it('will return question object with populated id field', inject(
            [ApiService, QuestionService],
            (apiService: MockApiService, questionService: QuestionService) => {
                let createdQuestion: Question;

                apiService.setResponse(questionPostResponse);
                apiService.init();
                questionService.createQuestion(newChooseOneQuestion).subscribe((res: Question) => createdQuestion = res);

                expect(createdQuestion).toEqual(questionApiResponse);
            }
        ));

        it('will throw an error if the text is not set', inject(
            [ApiService, QuestionService],
            (apiService: MockApiService, questionService: QuestionService) => {
                let questionWithEmptyText = Object.assign({}, newChooseOneQuestion);
                questionWithEmptyText.text = '';
                let message = 'Tekst pitanja mora biti zadat!';

                postInvalidQuestion(apiService, questionService, questionWithEmptyText, message);
            }
        ));

        it('will throw an error if type is numeric and answers property is empty', inject(
            [ApiService, QuestionService],
            (apiService: MockApiService, questionService: QuestionService) => {
                let numericQuestionWithNoAnswers = Object.assign({}, newNumericQuestion);
                numericQuestionWithNoAnswers.answers = [];
                let message = 'Tekst bar jednog polja za odgovor mora biti postavljen!';

                postInvalidQuestion(apiService, questionService, numericQuestionWithNoAnswers, message);
            }
        ));

        it('will throw an error if type is text and answers property is empty', inject(
            [ApiService, QuestionService],
            (apiService: MockApiService, questionService: QuestionService) => {
                let textQuestionWithNoAnswers = Object.assign({}, newTextQuestion);
                textQuestionWithNoAnswers.answers = [];
                let message = 'Tekst bar jednog polja za odgovor mora biti postavljen!';

                postInvalidQuestion(apiService, questionService, textQuestionWithNoAnswers, message);
            }
        ));

        it('will throw an error if type is choose_one and length of answers property is less than two', inject(
            [ApiService, QuestionService],
            (apiService: MockApiService, questionService: QuestionService) => {
                let chooseOneQuestionWithOneAnswers = Object.assign({}, newChooseOneQuestion);
                chooseOneQuestionWithOneAnswers.answers = ['Leonardo'];
                let message = 'Pitanje mora imati više ponuđenih odgovora!';

                postInvalidQuestion(apiService, questionService, chooseOneQuestionWithOneAnswers, message);
            }
        ));

        it('will throw an error if type is choose_multiple and length of answers property is less than two', inject(
            [ApiService, QuestionService],
            (apiService: MockApiService, questionService: QuestionService) => {
                let chooseMultipleQuestionWithOneAnswers = Object.assign({}, newChooseMultipleQuestion);
                chooseMultipleQuestionWithOneAnswers.answers = ['Leonardo'];
                let message = 'Pitanje mora imati više ponuđenih odgovora!';

                postInvalidQuestion(apiService, questionService, chooseMultipleQuestionWithOneAnswers, message);
            }
        ));

        it('will throw an error if user is not set', inject(
            [ApiService, QuestionService],
            (apiService: MockApiService, questionService: QuestionService) => {
                let chooseOneQuestionWithoutAuthor = Object.assign({}, newChooseOneQuestion);
                chooseOneQuestionWithoutAuthor.author = null;
                let message = 'Autor pitanja mora biti postavljen!'

                postInvalidQuestion(apiService, questionService, chooseOneQuestionWithoutAuthor, message);
            }
        ));
    });



});
