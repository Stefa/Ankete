import {async, ComponentFixture, inject, TestBed} from "@angular/core/testing";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AnswerService} from "../../../services/answer/answer.service";
import {LongTextQuestionForm} from "./long-text-question.form";
import {By} from "@angular/platform-browser";
import {DebugElement} from "@angular/core";
import {Question, questionTypes} from "../../../data/question.data";
import {Answer} from "../../../data/answer.data";
import {HttpModule} from "@angular/http";
import {ApiService} from "../../../services/api/api.service";
import {Observable} from "rxjs/Rx";

describe('LongTextQuestionForm', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [FormsModule, ReactiveFormsModule, HttpModule],
            declarations: [LongTextQuestionForm],
            providers: [
                AnswerService, ApiService
            ]
        })
            .compileComponents();
    }));

    let fixture: ComponentFixture<LongTextQuestionForm>;
    let component: LongTextQuestionForm;

    let question: Question = {
        id: 3,
        type: questionTypes.long_text,
        text: 'Write something',
        required: false,
        author: {id: 7},
        survey: {id: 4}
    };

    let longText = `For instance, on the planet Earth, man had always assumed that he was more intelligent 
        than dolphins because he had achieved so much—the wheel, New York, wars and so on—whilst all 
        the dolphins had ever done was muck about in the water having a good time. But conversely, 
        the dolphins had always believed that they were far more intelligent 
        than man—for precisely the same reasons.`;

    let answer: Answer = {
        id: 14,
        progress: {id: 9},
        question: {id: 3},
        answers: longText
    };

    beforeEach( () => {
        fixture = TestBed.createComponent(LongTextQuestionForm);
        component = fixture.componentInstance;
        component.question = question;
        component.answer = answer;
        fixture.detectChanges();
    });

    it('should display one text area for the answer', () => {
        let answerInput = fixture.debugElement.query(By.css('.long-text-answer'));
        expect(answerInput instanceof DebugElement).toBe(true);
    });

    it('should populate text area with existing answer', () => {
        let answerInput = fixture.debugElement.query(By.css('.long-text-answer textarea'));
        expect(answerInput.nativeElement.value).toBe(longText);
    });

    describe('answerQuestion', () => {
        it('should update answer that is passed to component', inject([AnswerService],
            (answerService: AnswerService) => {
                let answerInput = fixture.debugElement.query(By.css('.long-text-answer textarea'));
                let textArea = answerInput.nativeElement;
                let anotherLongText = "If there's anything more important than my ego around, I want it caught and shot now.";
                textArea.value = anotherLongText;
                textArea.dispatchEvent(new Event('input'));

                let newAnswer = $.extend(true, {}, answer);
                newAnswer.answers = anotherLongText;
                spyOn(answerService, 'updateAnswers').and.returnValue(Observable.of(newAnswer));

                component.answerQuestion().subscribe();

                expect(answerService.updateAnswers).toHaveBeenCalledWith(14, anotherLongText);
            }
        ));

        it('should create new answer if it is not passed to the  component', inject([AnswerService],
            (answerService: AnswerService) => {
                component.answer = null;
                component.progressId = 22;
                fixture.detectChanges();

                let answerInput = fixture.debugElement.query(By.css('.long-text-answer textarea'));
                let textArea = answerInput.nativeElement;
                textArea.value = longText;
                textArea.dispatchEvent(new Event('input'));

                let newAnswer = {
                    progress: {id: 22},
                    question: question,
                    answers: longText
                };
                let createdAnswer = $.extend(true, {}, newAnswer);
                spyOn(answerService, 'createAnswer').and.returnValue(Observable.of(createdAnswer));

                component.answerQuestion().subscribe();

                expect(answerService.createAnswer).toHaveBeenCalledWith(newAnswer);
            }
        ));
    });
});