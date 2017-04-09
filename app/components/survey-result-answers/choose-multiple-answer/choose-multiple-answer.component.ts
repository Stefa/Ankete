import {Component, Input, OnInit} from '@angular/core';
import {Question} from "../../../data/question.data";
import {Answer} from "../../../data/answer.data";

@Component({
    moduleId: module.id,
    selector: 'choose-multiple-answer',
    templateUrl: 'choose-multiple-answer.component.html'
})
export class ChooseMultipleAnswerComponent implements OnInit {
    @Input() question: Question;
    @Input() answer: Answer;

    answerLabels: Array<string>;

    constructor() { }

    ngOnInit() {

        this.answerLabels = [];

        if(this.answer == null) return;

        if (this.answer.answers instanceof Array)
            (<Array<number>>(this.answer.answers)).forEach(
                labelIndex => this.answerLabels.push(this.question.answerLabels[labelIndex])
            );

        if(this.answer.userAnswer)
            this.answerLabels.push(this.answer.userAnswer);
    }

}
