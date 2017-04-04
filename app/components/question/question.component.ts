import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Question, questionTypes} from "../../data/question.data";
import {Answer} from "../../data/answer.data";
import {Observable} from "rxjs/Rx";
import {NumericQuestionForm} from "../../forms/survey-fill-out/numeric-question/numeric-question.form";
import {TextQuestionForm} from "../../forms/survey-fill-out/text-question/text-question.form";
import {LongTextQuestionForm} from "../../forms/survey-fill-out/long-text-question/long-text-question.form";
import {ChooseOneQuestionForm} from "../../forms/survey-fill-out/choose-one-question/choose-one-question.form";
import {ChooseMultipleQuestionForm} from "../../forms/survey-fill-out/choose-multiple-question/choose-multiple-question.form";

type QuestionForms = NumericQuestionForm | TextQuestionForm | LongTextQuestionForm
    | ChooseOneQuestionForm | ChooseMultipleQuestionForm;

@Component({
    moduleId: module.id,
    selector: 'question',
    templateUrl: 'question.component.html'
})
export class QuestionComponent implements OnInit {
    @Input() progressId: number;
    @Input() question: Question;
    @Input() answer: Answer;
    @ViewChild('questionForm') questionForm: QuestionForms;

    questionTypes = questionTypes;

    constructor() { }

    ngOnInit() { }

    updateQuestionAnswer(): Observable<Answer> {
        return this.questionForm.answerQuestion();
    }

}
