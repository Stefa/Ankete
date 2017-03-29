import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Question} from "../../../data/question.data";
import {Answer} from "../../../data/answer.data";
import {FormArray, FormControl, FormGroup} from "@angular/forms";
import {AnswerService} from "../../../services/answer/answer.service";
import {Observable} from "rxjs/Rx";

@Component({
    moduleId: module.id,
    selector: 'numeric-question',
    templateUrl: 'numeric-question.form.html'
})
export class NumericQuestionForm implements OnInit {
    @Input() question: Question;
    @Input() answer: Answer;
    @Input() progressId: number;

    numericQuestionFormGroup: FormGroup;
    answersControl;

    answerStrings: Array<string>;
    answerLabels: Array<string>;

    constructor(private answerService: AnswerService) { }

    ngOnInit() {
        this.answerLabels = this.question.answerLabels;
        this.answerStrings = (this.answer && this.answer.answers)
            ? this.createAnswerStringsFromAnswers() : new Array(this.answerLabels.length).fill('');

        this.createFormGroup();
    }

    private createAnswerStringsFromAnswers() {
        let answers = (this.answer.answers instanceof Array) ? this.answer.answers : [this.answer.answers];
        return answers.map(answer => <string>answer);
    }

    private createFormGroup() {
        let answerArray = this.answerStrings.map(answer => new FormControl(answer));
        let answers: FormArray = new FormArray(answerArray);

        this.numericQuestionFormGroup = new FormGroup({
            answers: answers
        });
        this.answersControl = this.numericQuestionFormGroup.get('answers');
    }

    answerQuestion(): Observable<Answer> {
        if(!this.numericQuestionFormGroup.dirty) return Observable.of(null);

        let answers = this.numericQuestionFormGroup.value.answers;
        return (this.answer) ? this.updateAnswer(answers) : this.createAnswer(answers);
    }

    private createAnswer(answers: Array<string>): Observable<Answer> {
        let answerObject: Answer = {
            answers: answers,
            question: this.question,
            progress: {id: this.progressId},
        };
        return this.answerService.createAnswer(answerObject);
    }

    private updateAnswer(answers: Array<string>): Observable<Answer> {
        return this.answerService.updateAnswers(this.answer.id, answers);
    }
}
