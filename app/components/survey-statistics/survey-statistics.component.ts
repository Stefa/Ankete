import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {StatisticsService} from "../../services/statistics/statistics.service";

@Component({
    moduleId: module.id,
    selector: 'survey-statistics',
    templateUrl: 'survey-statistics.component.html'
})

export class SurveyStatisticsComponent implements OnInit {
    questions: any;

    constructor(private route: ActivatedRoute, private statistics: StatisticsService) {}

    ngOnInit() {
        let questionsData = this.route.snapshot.data['questions'];
        this.questions = this.statistics.getQuestionsStatistics(questionsData);
    }
}
