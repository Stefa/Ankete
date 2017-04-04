import {Component, Input, OnInit} from '@angular/core';
import {Question} from "../../../data/question.data";
import {Answer} from "../../../data/answer.data";
import {Observable} from "rxjs/Rx";
import {FormControl, FormGroup} from "@angular/forms";
import {AnswerService} from "../../../services/answer/answer.service";

@Component({
    moduleId: module.id,
    selector: 'choose-one-question',
    templateUrl: 'choose-one-question.form.html',
    styleUrls: ['choose-one-question.form.css']
})
export class ChooseOneQuestionForm implements OnInit {
    @Input() question: Question;
    @Input() answer: Answer;
    @Input() progressId: number;

    chooseOneQuestionFormGroup: FormGroup;
    chosenAnswer: any;

    answerLabels: Array<string>;

    hasUserAnswerOption: boolean = false;
    userAnswerLabel: string;
    userAnswer: string;
    showUserAnswerInput: boolean = false;

    constructor(private answerService: AnswerService) { }

    ngOnInit() {
        this.answerLabels = this.question.answerLabels;
        this.chosenAnswer = (this.answer && this.answer.answers)
            ? this.answer.answers : 0;

        this.hasUserAnswerOption = this.question.otherAnswer != null;
        this.userAnswerLabel = this.question.otherAnswer;
        this.userAnswer = (this.answer && this.answer.userAnswer)
            ? this.answer.userAnswer : '';
        this.showUserAnswerInput = this.chosenAnswer == "other";

        this.createFormGroup();

        if(this.hasUserAnswerOption) {
            this.chooseOneQuestionFormGroup.valueChanges.subscribe(
                value => this.showUserAnswerInput = value.answer == "other"
            );
        }
    }

    private createFormGroup() {
        this.chooseOneQuestionFormGroup = new FormGroup({
            answer: new FormControl(this.chosenAnswer)
        });
        if(this.hasUserAnswerOption) {
            this.chooseOneQuestionFormGroup.addControl(
                'userAnswer', new FormControl(this.userAnswer)
            );
        }
    }

    answerQuestion(): Observable<Answer> {
        if(!this.chooseOneQuestionFormGroup.dirty && this.answer != null) return Observable.of(null);

        let formValues = this.chooseOneQuestionFormGroup.value;
        let answerObject: Answer = {
            answers: formValues.answer,
            question: this.question,
            progress: {id: this.progressId},
        };
        if(this.hasUserAnswerOption && formValues.answer == 'other') {
            answerObject.userAnswer = formValues.userAnswer;
        }
        return (this.answer) ? this.updateAnswer(answerObject) : this.createAnswer(answerObject);
    }

    private createAnswer(answer: Answer): Observable<Answer> {
        return this.answerService.createAnswer(answer);
    }

    private updateAnswer(answer: Answer): Observable<Answer> {
        return this.answerService.updateAnswer(this.answer.id, answer);
    }
}

