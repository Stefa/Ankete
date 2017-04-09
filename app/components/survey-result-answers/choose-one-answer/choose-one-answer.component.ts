import {Component, Input, OnInit} from '@angular/core';
import {Question} from "../../../data/question.data";
import {Answer} from "../../../data/answer.data";

@Component({
    moduleId: module.id,
    selector: 'choose-one-answer',
    templateUrl: 'choose-one-answer.component.html'
})
export class ChooseOneAnswerComponent implements OnInit {
    @Input() question: Question;
    @Input() answer: Answer;

    answerLabel: string;

    constructor() { }

    ngOnInit() {
        this.answerLabel = '';

        if(this.answer == null) return;

        if(this.answer.answers == 'other' && this.answer.userAnswer)
            this.answerLabel = this.answer.userAnswer;

        if(typeof this.answer.answers == 'number')
            this.answerLabel = this.question.answerLabels[<number>this.answer.answers];
    }

}
