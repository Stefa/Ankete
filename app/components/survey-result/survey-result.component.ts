import { Component, OnInit } from '@angular/core';
import {Answer} from "../../data/answer.data";
import {Question} from "../../data/question.data";
import {ActivatedRoute, Router} from "@angular/router";
import {Survey} from "../../data/survey.data";

@Component({
    moduleId: module.id,
    selector: 'survey-result',
    templateUrl: 'survey-result.component.html'
})
export class SurveyResultComponent implements OnInit {
    allAnswers: Array<{question: Question, answer: Answer}>;
    survey: Survey;
    constructor(private route: ActivatedRoute, private router: Router) { }

    ngOnInit() {
        this.prepareAnswers();
    }

    prepareAnswers() {
        this.survey = this.route.snapshot.data['survey'];
        let progress = this.route.snapshot.data['progress'];

        let answers = this.createAnswerMap(progress);

        this.allAnswers = this.survey.questions
            .map(question => {
                return {question: question, answer: answers.get(question.id)};
            });
    }

    private createAnswerMap(progress): Map<number, Answer> {
        let answers = (progress && progress.answers) ? progress.answers : [];
        return new Map<number, Answer>(answers.map(
            answer => <[number, Answer]>[answer.question.id, answer]
        ));
    }

    private goBack() {
        let backLink;
        switch(this.route.routeConfig.path) {
            case 'result/:surveyId/:progressId':
                backLink = ['/results', this.survey.id];
                break;
            case 'result':
                backLink = ['/survey', this.survey.id, 'info'];
                break;
            case 'result/:progressId':
                backLink = ['/surveys'];
                break;
        }
        this.router.navigate(backLink);
    }
}
