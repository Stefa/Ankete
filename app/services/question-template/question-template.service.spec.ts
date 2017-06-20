import {inject, TestBed} from "@angular/core/testing";
import {ApiService} from "../api/api.service";
import {MockApiService} from "../api/mock-api.service";
import {QuestionTemplateService} from "./question-template.service";
import {questionTypes} from "../../data/question.data";
import {QuestionTemplate} from "../../data/questionTemplate.data";
describe('QuestionTemplateService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                QuestionTemplateService,
                {provide: ApiService, useClass: MockApiService}
            ]
        })
    });

    describe('create', () => {
        it('should send a post request to "templates" path with new question template data',
            inject(
                [ApiService, QuestionTemplateService],
                (api: MockApiService, questionTemplateService: QuestionTemplateService) => {
                    let newTemplate: QuestionTemplate = {
                        type: questionTypes.choose_one,
                        text: 'What is your favourite turtle?',
                        answerLabels: ['Donatello', 'Leonardo', 'Michelangelo', 'Raphael'],
                        required: true,
                        author: {id: 7}
                    };
                    let expectedApiRequest = {
                        type: questionTypes.choose_one,
                        text: 'What is your favourite turtle?',
                        answerLabels: ['Donatello', 'Leonardo', 'Michelangelo', 'Raphael'],
                        required: true,
                        userId: 7
                    };
                    let apiResponse = {
                        type: questionTypes.choose_one,
                        text: 'What is your favourite turtle?',
                        answerLabels: ['Donatello', 'Leonardo', 'Michelangelo', 'Raphael'],
                        required: true,
                        id: 1,
                        userId: 7
                    };

                    api.setResponse(apiResponse);
                    api.init();
                    questionTemplateService.create(newTemplate).subscribe();
                    expect(api.post).toHaveBeenCalledWith('templates', expectedApiRequest);
                }
            )
        );
    });

    describe('getAll', () => {
        let apiResponse = [
            {
                type: questionTypes.choose_one,
                text: 'What is your favourite turtle?',
                answerLabels: ['Donatello', 'Leonardo', 'Michelangelo', 'Raphael'],
                required: true,
                id: 2,
                userId: 7
            },
            {
                type: questionTypes.text,
                text: 'What is your name',
                answerLabels: [''],
                required: true,
                id: 1,
                userId: 7
            }
        ];
        let expectedMethodResponse = [
            {
                type: questionTypes.choose_one,
                text: 'What is your favourite turtle?',
                answerLabels: ['Donatello', 'Leonardo', 'Michelangelo', 'Raphael'],
                required: true,
                id: 2,
                author:{id: 7}
            },
            {
                type: questionTypes.text,
                text: 'What is your name',
                answerLabels: [''],
                required: true,
                id: 1,
                author:{id: 7}
            }
        ];
        it('should send a get request to "templates" path', inject(
            [ApiService, QuestionTemplateService],
            (api: MockApiService, questionTemplateService: QuestionTemplateService) => {
                api.setResponse(apiResponse);
                api.init();
                questionTemplateService.getAll().subscribe();
                expect(api.get).toHaveBeenCalledWith('templates');
            }
        ));

        it('should return array of QuestionTemplate objects', inject(
            [ApiService, QuestionTemplateService],
            (api: MockApiService, questionTemplateService: QuestionTemplateService) => {
                let response;
                api.setResponse(apiResponse);
                api.init();
                questionTemplateService.getAll().subscribe(
                    res => response = res
                );
                expect(response).toEqual(expectedMethodResponse);
            }
        ));
    });
});
