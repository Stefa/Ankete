import {async, ComponentFixture, inject, TestBed} from "@angular/core/testing";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AnswerService} from "../../../services/answer/answer.service";
import {By} from "@angular/platform-browser";
import {DebugElement} from "@angular/core";
import {Question, questionTypes} from "../../../data/question.data";
import {Answer} from "../../../data/answer.data";
import {HttpModule} from "@angular/http";
import {ApiService} from "../../../services/api/api.service";
import {Observable} from "rxjs/Rx";
import {ChooseMultipleQuestionForm} from "./choose-multiple-question.form";

describe('ChooseMultipleQuestionForm', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [FormsModule, ReactiveFormsModule, HttpModule],
            declarations: [ChooseMultipleQuestionForm],
            providers: [
                AnswerService, ApiService
            ]
        })
            .compileComponents();
    }));

    let fixture: ComponentFixture<ChooseMultipleQuestionForm>;
    let component: ChooseMultipleQuestionForm;

    describe('without user answer', () => {
        let question: Question = {
            id: 3,
            type: questionTypes.choose_multiple,
            text: 'Choose numbers',
            required: false,
            answerLabels: ['3', '5', '7'],
            author: {id: 7},
            survey: {id: 4}
        };

        let answer: Answer = {
            id: 14,
            progress: {id: 9},
            question: {id: 3},
            answers: [0,2]
        };

        beforeEach( () => {
            fixture = TestBed.createComponent(ChooseMultipleQuestionForm);
            component = fixture.componentInstance;
            component.question = question;
            component.answer = answer;
            component.progressId = 9;
        });

        it('should display three checkbox fields provided the question with three answer labels', () => {
            fixture.detectChanges();
            let answerInputs = fixture.debugElement.queryAll(By.css('.choose-multiple-answer'));

            expect(answerInputs.length).toBe(3);
            answerInputs.forEach(
                input => expect(input instanceof DebugElement).toBe(true)
            );
        });

        it('should check the option specified in provided answer', () => {
            fixture.detectChanges();
            let answerInputs = fixture.debugElement.queryAll(By.css('.choose-multiple-answer input'));

            expect(answerInputs[0].nativeElement.checked).toBe(true);
            expect(answerInputs[1].nativeElement.checked).toBe(false);
            expect(answerInputs[2].nativeElement.checked).toBe(true);
        });

        describe('answerQuestion', () => {
            it('should update answer that is passed to component', inject([AnswerService],
                (answerService: AnswerService) => {
                    fixture.detectChanges();
                    let answerInputs = fixture.debugElement.queryAll(By.css('.choose-multiple-answer input'));
                    let inputElement = answerInputs[1].nativeElement;
                    inputElement.click();
                    fixture.detectChanges();

                    let expectedAnswerRequest = $.extend(true, {}, answer);
                    expectedAnswerRequest.answers = [0,1,2];
                    expectedAnswerRequest.question = question;
                    delete expectedAnswerRequest.id;

                    let answerResponse = $.extend(true, {}, answer);
                    answerResponse.answers = [0,1,2];
                    spyOn(answerService, 'updateAnswer').and.returnValue(Observable.of(answerResponse));

                    component.answerQuestion().subscribe();

                    expect(answerService.updateAnswer).toHaveBeenCalledWith(14, expectedAnswerRequest);
                }
            ));

            it('should create new answer if it is not passed to the component', inject([AnswerService],
                (answerService: AnswerService) => {
                    component.answer = null;
                    fixture.detectChanges();
                    let answerInputs = fixture.debugElement.queryAll(By.css('.choose-multiple-answer input'));
                    let inputElement = answerInputs[2].nativeElement;
                    inputElement.click();
                    fixture.detectChanges();

                    let expectedAnswerRequest = $.extend(true, {}, answer);
                    expectedAnswerRequest.answers = [2];
                    expectedAnswerRequest.question = question;
                    delete expectedAnswerRequest.id;

                    let answerResponse = $.extend(true, {}, answer);
                    answerResponse.answers = [2];
                    spyOn(answerService, 'createAnswer').and.returnValue(Observable.of(answerResponse));

                    component.answerQuestion().subscribe();

                    expect(answerService.createAnswer).toHaveBeenCalledWith(expectedAnswerRequest);
                }
            ));
        });
    });

    describe('with user answer', () => {
        let question: Question = {
            id: 3,
            type: questionTypes.choose_multiple,
            text: 'Choose numbers',
            required: false,
            answerLabels: ['3', '5', '7'],
            author: {id: 7},
            survey: {id: 4},
            otherAnswer: 'other'
        };

        let answer: Answer = {
            id: 14,
            progress: {id: 9},
            question: {id: 3},
            answers: [1],
            userAnswer: 'my answer'
        };

        beforeEach( () => {
            fixture = TestBed.createComponent(ChooseMultipleQuestionForm);
            component = fixture.componentInstance;

            component.question = question;
            component.answer = answer;
            component.progressId = 9;
        });

        it('should display input for user answer if other option is selected', () => {
            fixture.detectChanges();
            let userAnswerInput = fixture.debugElement.query(By.css('.user-answer'));

            expect(userAnswerInput instanceof DebugElement).toBe(true)
        });

        it('should populate text fields with user answer', () => {
            fixture.detectChanges();
            let userAnswerInput = fixture.debugElement.query(By.css('.user-answer input'));

            expect(userAnswerInput.nativeElement.value).toBe('my answer');
        });

        describe('answerQuestion', () => {
            it('should update answer that is passed to component', inject([AnswerService],
                (answerService: AnswerService) => {
                    fixture.detectChanges();
                    let userAnswerInput = fixture.debugElement.query(By.css('.user-answer input'));
                    let userAnswerInputElement = userAnswerInput.nativeElement;
                    userAnswerInputElement.value = "my other answer";
                    userAnswerInputElement.dispatchEvent(new Event('input'));

                    let expectedAnswerRequest = $.extend(true, {}, answer);
                    expectedAnswerRequest.userAnswer = 'my other answer';
                    expectedAnswerRequest.question = question;
                    delete expectedAnswerRequest.id;

                    let answerResponse = $.extend(true, {}, answer);
                    answerResponse.userAnswer = 'my other answer';
                    spyOn(answerService, 'updateAnswer').and.returnValue(Observable.of(answerResponse));

                    component.answerQuestion().subscribe();

                    expect(answerService.updateAnswer).toHaveBeenCalledWith(14, expectedAnswerRequest);
                }
            ));

            it('should create new answer if it is not passed to the component', inject([AnswerService],
                (answerService: AnswerService) => {
                    component.answer = null;
                    fixture.detectChanges();

                    let answerInputs = fixture.debugElement.queryAll(By.css('.choose-multiple-answer input'));
                    let inputElement = answerInputs[1].nativeElement;
                    inputElement.click();

                    let otherOption = fixture.debugElement.query(By.css('.check-other input')).nativeElement;
                    otherOption.click();
                    fixture.detectChanges();

                    let userAnswerInput = fixture.debugElement.query(By.css('.user-answer input')).nativeElement;
                    userAnswerInput.value = "my other answer";
                    userAnswerInput.dispatchEvent(new Event('input'));

                    let expectedAnswerRequest = $.extend(true, {}, answer);
                    expectedAnswerRequest.userAnswer = 'my other answer';
                    expectedAnswerRequest.question = question;
                    delete expectedAnswerRequest.id;

                    let answerResponse = $.extend(true, {}, answer);
                    answerResponse.userAnswer = 'my other answer';
                    spyOn(answerService, 'createAnswer').and.returnValue(Observable.of(answerResponse));

                    component.answerQuestion().subscribe();

                    expect(answerService.createAnswer).toHaveBeenCalledWith(expectedAnswerRequest);
                }
            ));
        });
    });
});
