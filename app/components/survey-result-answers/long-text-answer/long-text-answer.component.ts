import {Component, Input, OnInit} from '@angular/core';
import {Question} from "../../../data/question.data";
import {Answer} from "../../../data/answer.data";

@Component({
    moduleId: module.id,
    selector: 'long-text-answer',
    templateUrl: 'long-text-answer.component.html'
})
export class LongTextAnswerComponent implements OnInit {
    @Input() question: Question;
    @Input() answer: Answer;

    answerText: string;

    constructor() { }

    ngOnInit() {
        this.answerText = this.answer ? <string>(this.answer.answers) : "";
    }

}
