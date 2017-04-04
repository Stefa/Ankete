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
import {ChooseOneQuestionForm} from "./choose-one-question.form";

describe('ChooseOneQuestionForm', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [FormsModule, ReactiveFormsModule, HttpModule],
            declarations: [ChooseOneQuestionForm],
            providers: [
                AnswerService, ApiService
            ]
        })
            .compileComponents();
    }));

    let fixture: ComponentFixture<ChooseOneQuestionForm>;
    let component: ChooseOneQuestionForm;

    let question: Question = {
        id: 3,
        type: questionTypes.choose_one,
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
        answers: 1
    };

    describe('without user answer', () => {

        beforeEach( () => {
            fixture = TestBed.createComponent(ChooseOneQuestionForm);
            component = fixture.componentInstance;
            component.question = question;
            component.answer = answer;
            fixture.detectChanges();
        });

        it('should display three radio input fields provided the question with three answer labels', () => {
            let answerInputs = fixture.debugElement.queryAll(By.css('.choose-one-answer'));

            expect(answerInputs.length).toBe(3);
            answerInputs.forEach(
                input => expect(input instanceof DebugElement).toBe(true)
            );
        });

        it('should check the option specified in provided answer', () => {
            let answerInputs = fixture.debugElement.queryAll(By.css('.choose-one-answer input'));

            expect(answerInputs[0].nativeElement.checked).toBe(false);
            expect(answerInputs[1].nativeElement.checked).toBe(true);
            expect(answerInputs[2].nativeElement.checked).toBe(false);
        });

        describe('answerQuestion', () => {
            it('should update answer that is passed to component', inject([AnswerService],
                (answerService: AnswerService) => {
                    component.progressId = 9;
                    let answerInputs = fixture.debugElement.queryAll(By.css('.choose-one-answer input'));
                    let inputElement = answerInputs[2].nativeElement;
                    inputElement.click();
                    fixture.detectChanges();

                    let expectedAnswerRequest = $.extend(true, {}, answer);
                    expectedAnswerRequest.answers = 2;
                    expectedAnswerRequest.question = question;
                    delete expectedAnswerRequest.id;

                    let answerResponse = $.extend(true, {}, answer);
                    answerResponse.answers = 2;
                    spyOn(answerService, 'updateAnswer').and.returnValue(Observable.of(answerResponse));

                    component.answerQuestion().subscribe();

                    expect(answerService.updateAnswer).toHaveBeenCalledWith(14, expectedAnswerRequest);
                }
            ));

            it('should create new answer if it is not passed to the component', inject([AnswerService],
                (answerService: AnswerService) => {
                    component.answer = null;
                    component.progressId = 9;
                    fixture.detectChanges();
                    let answers = 2;
                    let answerInputs = fixture.debugElement.queryAll(By.css('.choose-one-answer input'));
                    let inputElement = answerInputs[2].nativeElement;
                    inputElement.click();
                    fixture.detectChanges();

                    let expectedAnswerRequest = $.extend(true, {}, answer);
                    expectedAnswerRequest.answers = 2;
                    expectedAnswerRequest.question = question;
                    delete expectedAnswerRequest.id;

                    let answerResponse = $.extend(true, {}, answer);
                    answerResponse.answers = 2;
                    spyOn(answerService, 'createAnswer').and.returnValue(Observable.of(answerResponse));

                    component.answerQuestion().subscribe();

                    expect(answerService.createAnswer).toHaveBeenCalledWith(expectedAnswerRequest);
                }
            ));
        });
    });

    describe('with user answer', () => {
        let questionWithOtherOption = $.extend(true, {}, question);
        questionWithOtherOption.otherAnswer = 'other';

        let answerWithUserAnswer = $.extend(true, {}, answer);
        answerWithUserAnswer.answers = 'other';
        answerWithUserAnswer.userAnswer = 'my answer';

        beforeEach( () => {
            fixture = TestBed.createComponent(ChooseOneQuestionForm);
            component = fixture.componentInstance;

            component.question = questionWithOtherOption;
            component.answer = answerWithUserAnswer;
            fixture.detectChanges();
        });

        it('should display input for user answer if other option is selected', () => {
            let userAnswerInput = fixture.debugElement.query(By.css('.user-answer'));

            expect(userAnswerInput instanceof DebugElement).toBe(true)

        });

        it('should populate text fields with user answer', () => {
            let userAnswerInput = fixture.debugElement.query(By.css('.user-answer input'));

            expect(userAnswerInput.nativeElement.value).toBe('my answer');
        });

        describe('answerQuestion', () => {
            it('should update answer that is passed to component', inject([AnswerService],
                (answerService: AnswerService) => {
                    component.progressId = 9;
                    let userAnswerInput = fixture.debugElement.query(By.css('.user-answer input'));
                    let userAnswerInputElement = userAnswerInput.nativeElement;
                    userAnswerInputElement.value = "my other answer";
                    userAnswerInputElement.dispatchEvent(new Event('input'));

                    let expectedAnswerRequest = $.extend(true, {}, answerWithUserAnswer);
                    expectedAnswerRequest.userAnswer = 'my other answer';
                    expectedAnswerRequest.question = questionWithOtherOption;
                    delete expectedAnswerRequest.id;

                    let answerResponse = $.extend(true, {}, answerWithUserAnswer);
                    answerResponse.userAnswer = 'my other answer';
                    spyOn(answerService, 'updateAnswer').and.returnValue(Observable.of(answerResponse));

                    component.answerQuestion().subscribe();

                    expect(answerService.updateAnswer).toHaveBeenCalledWith(14, expectedAnswerRequest);
                }
            ));

            it('should create new answer if it is not passed to the component', inject([AnswerService],
                (answerService: AnswerService) => {
                    component.answer = null;
                    component.progressId = 9;
                    fixture.detectChanges();

                    let otherOption = fixture.debugElement.query(By.css('.choose-other input')).nativeElement;
                    otherOption.click();
                    fixture.detectChanges();

                    let userAnswerInput = fixture.debugElement.query(By.css('.user-answer input')).nativeElement;
                    userAnswerInput.value = "my other answer";
                    userAnswerInput.dispatchEvent(new Event('input'));

                    let expectedAnswerRequest = $.extend(true, {}, answerWithUserAnswer);
                    expectedAnswerRequest.userAnswer = 'my other answer';
                    expectedAnswerRequest.question = questionWithOtherOption;
                    delete expectedAnswerRequest.id;

                    let answerResponse = $.extend(true, {}, answerWithUserAnswer);
                    answerResponse.userAnswer = 'my other answer';
                    spyOn(answerService, 'createAnswer').and.returnValue(Observable.of(answerResponse));

                    component.answerQuestion().subscribe();

                    expect(answerService.createAnswer).toHaveBeenCalledWith(expectedAnswerRequest);
                }
            ));
        });
    });
});