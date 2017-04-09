import {Component, Input, OnInit} from '@angular/core';
import {Answer} from "../../data/answer.data";
import {Question, questionTypes} from "../../data/question.data";

@Component({
    moduleId: module.id,
    selector: 'answer',
    templateUrl: 'answer.component.html'
})
export class AnswerComponent implements OnInit {
    @Input() question: Question;
    @Input() answer: Answer;

    questionTypes = questionTypes;

    constructor() { }

    ngOnInit() { }

}