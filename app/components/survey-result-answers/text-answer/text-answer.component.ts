import {Component, Input, OnInit} from '@angular/core';
import {Question} from "../../../data/question.data";
import {Answer} from "../../../data/answer.data";

@Component({
    moduleId: module.id,
    selector: 'text-answer',
    templateUrl: 'text-answer.component.html'
})
export class TextAnswerComponent implements OnInit {
    @Input() question: Question;
    @Input() answer: Answer;

    answers: Array<{label: string, answer: string}>;

    constructor() { }

    ngOnInit() {
        let labels = this.question.answerLabels;
        let answers = this.answer ?
            (<Array<string>>(this.answer.answers)).map(answer => answer != null ? answer : "") :
            new Array(labels.length).fill("");
        this.answers = labels.map(
            (label, index) => {
                return {label: label, answer: answers[index]};
            }
        );
    }

}
