import {Component, Input, OnInit} from '@angular/core';
import {Question} from "../../../data/question.data";
import {Answer} from "../../../data/answer.data";
import {Observable} from "rxjs/Rx";
import {FormControl, FormGroup} from "@angular/forms";
import {AnswerService} from "../../../services/answer/answer.service";

@Component({
    moduleId: module.id,
    selector: 'long-text-question',
    templateUrl: 'long-text-question.form.html'
})
export class LongTextQuestionForm implements OnInit {
    @Input() question: Question;
    @Input() answer: Answer;
    @Input() progressId: number;

    longTextQuestionFormGroup: FormGroup;
    answerControl;

    answerString: string;

    constructor(private answerService: AnswerService) { }

    ngOnInit() {
        this.answerString = (this.answer && this.answer.answers)
            ? <string>this.answer.answers : '';

        this.createFormGroup();
    }

    private createFormGroup() {
        this.longTextQuestionFormGroup = new FormGroup({
            answer: new FormControl(this.answerString)
        });
        this.answerControl = this.longTextQuestionFormGroup.get('answer');
    }

    answerQuestion(): Observable<Answer> {
        if(!this.longTextQuestionFormGroup.dirty) return Observable.of(null);

        let answer = this.longTextQuestionFormGroup.value.answer;
        return (this.answer) ? this.updateAnswer(answer) : this.createAnswer(answer);
    }

    private createAnswer(answer: string): Observable<Answer> {
        let answerObject: Answer = {
            answers: answer,
            question: this.question,
            progress: {id: this.progressId},
        };
        return this.answerService.createAnswer(answerObject);
    }

    private updateAnswer(answer: string): Observable<Answer> {
        return this.answerService.updateAnswers(this.answer.id, answer);
    }
}
