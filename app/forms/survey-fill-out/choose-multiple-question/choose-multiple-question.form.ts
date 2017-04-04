import {Component, Input, OnInit} from '@angular/core';
import {Question} from "../../../data/question.data";
import {Answer} from "../../../data/answer.data";
import {Observable} from "rxjs/Rx";
import {FormArray, FormControl, FormGroup} from "@angular/forms";
import {AnswerService} from "../../../services/answer/answer.service";

@Component({
    moduleId: module.id,
    selector: 'choose-multiple-question',
    templateUrl: 'choose-multiple-question.form.html',
    styleUrls: ['choose-multiple-question.form.css']
})
export class ChooseMultipleQuestionForm implements OnInit {
    answersControl;
    @Input() question: Question;
    @Input() answer: Answer;
    @Input() progressId: number;

    chooseMultipleQuestionFormGroup: FormGroup;
    chosenAnswers: any;

    answerLabels: Array<string>;

    hasUserAnswerOption: boolean = false;
    userAnswerLabel: string;
    userAnswer: string;
    showUserAnswerInput: boolean = false;

    constructor(private answerService: AnswerService) { }

    ngOnInit() {
        this.answerLabels = this.question.answerLabels;
        this.chosenAnswers = (this.answer && this.answer.answers)
            ? this.answer.answers : [];

        this.hasUserAnswerOption = this.question.otherAnswer != null;
        this.userAnswerLabel = this.question.otherAnswer;
        this.showUserAnswerInput = this.answer!=null && this.answer.userAnswer!=null;
        this.userAnswer = (this.showUserAnswerInput)
            ? this.answer.userAnswer : '';

        this.createFormGroup();
    }

    private createFormGroup() {
        let optionControls = new Array(this.answerLabels.length).fill(false)
            .map((value, index) => this.chosenAnswers.includes(index))
            .map(value => new FormControl(value));
        let optionsArray = new FormArray(optionControls);

        this.chooseMultipleQuestionFormGroup = new FormGroup({
            answers: optionsArray
        });
        if(this.hasUserAnswerOption) {
            this.chooseMultipleQuestionFormGroup.addControl(
                'otherAnswer', new FormControl(this.showUserAnswerInput)
            );
            this.chooseMultipleQuestionFormGroup.addControl(
                'userAnswer', new FormControl(this.userAnswer)
            );
        }

        this.answersControl = this.chooseMultipleQuestionFormGroup.get('answers');
    }

    changeUserAnswerVisibility() {
        this.showUserAnswerInput = this.chooseMultipleQuestionFormGroup.get('otherAnswer').value;
    }

    answerQuestion(): Observable<Answer> {
        if(!this.chooseMultipleQuestionFormGroup.dirty && this.answer != null) return Observable.of(null);

        let formValues = this.chooseMultipleQuestionFormGroup.value;
        let answers = formValues.answers
            .map((checked, index) => checked ? index : -1)
            .filter(value => value >= 0);
        let answerObject: Answer = {
            answers: answers,
            question: this.question,
            progress: {id: this.progressId},
        };
        if(this.showUserAnswerInput && formValues.otherAnswer && formValues.userAnswer != '') {
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

