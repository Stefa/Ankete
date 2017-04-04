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
import {TextQuestionForm} from "./text-question.form";

describe('TextQuestionForm', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [FormsModule, ReactiveFormsModule, HttpModule],
            declarations: [TextQuestionForm],
            providers: [
                AnswerService, ApiService
            ]
        })
            .compileComponents();
    }));

    let fixture: ComponentFixture<TextQuestionForm>;
    let component: TextQuestionForm;

    let question: Question = {
        id: 3,
        type: questionTypes.text,
        text: 'Write names',
        required: false,
        answerLabels: ['name1', 'name2', 'name3'],
        author: {id: 7},
        survey: {id: 4}
    };

    let answer: Answer = {
        id: 14,
        progress: {id: 9},
        question: {id: 3},
        answers: ['Dikembe', 'Mutombo', null]
    };

    beforeEach( () => {
        fixture = TestBed.createComponent(TextQuestionForm);
        component = fixture.componentInstance;
        component.question = question;
        component.answer = answer;
        fixture.detectChanges();
    });

    it('should display three text fields provided the question with three answer labels', () => {
        let answerInputs = fixture.debugElement.queryAll(By.css('.text-answer'));

        expect(answerInputs.length).toBe(3);
        answerInputs.forEach(
            input => expect(input instanceof DebugElement).toBe(true)
        );
    });

    it('should populate text fields with existing answers', () => {
        let answerInputs = fixture.debugElement.queryAll(By.css('.text-answer input'));

        expect(answerInputs[0].nativeElement.value).toBe("Dikembe");
        expect(answerInputs[1].nativeElement.value).toBe("Mutombo");
        expect(answerInputs[2].nativeElement.value).toBe("");
    });

    describe('answerQuestion', () => {
        it('should update answer that is passed to component', inject([AnswerService],
            (answerService: AnswerService) => {
                let answerInputs = fixture.debugElement.queryAll(By.css('.text-answer input'));
                let inputElement = answerInputs[2].nativeElement;
                inputElement.value = "Mpolondo";
                inputElement.dispatchEvent(new Event('input'));

                let newAnswer = $.extend(true, {}, answer);
                newAnswer.answers[2] = "Mpolondo";
                spyOn(answerService, 'updateAnswers').and.returnValue(Observable.of(newAnswer));

                component.answerQuestion().subscribe();

                expect(answerService.updateAnswers).toHaveBeenCalledWith(14, ['Dikembe', 'Mutombo', "Mpolondo"]);
            }
        ));

        it('should create new answer if it is not passed to the  component', inject([AnswerService],
            (answerService: AnswerService) => {
                component.answer = null;
                component.progressId = 22;
                fixture.detectChanges();
                let answers = ['Dikembe', 'Mutombo', "Mpolondo"];
                let answerInputs = fixture.debugElement.queryAll(By.css('.text-answer input'));
                answerInputs.forEach((answer, index) => {
                    let inputElement = answer.nativeElement;
                    inputElement.value = answers[index];
                    inputElement.dispatchEvent(new Event('input'));
                });

                let newAnswer = {
                    progress: {id: 22},
                    question: question,
                    answers: answers
                };
                let createdAnswer = $.extend(true, {}, newAnswer);
                spyOn(answerService, 'createAnswer').and.returnValue(Observable.of(createdAnswer));

                component.answerQuestion().subscribe();

                expect(answerService.createAnswer).toHaveBeenCalledWith(newAnswer);
            }
        ));
    });
});