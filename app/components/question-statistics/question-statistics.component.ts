import {Component, Input, OnInit} from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'question-statistics',
    templateUrl: 'question-statistics.component.html'
})

export class QuestionStatisticsComponent implements OnInit {
    @Input() text: string;
    @Input() answers: Array<any>;

    constructor() {}

    ngOnInit() {}
}