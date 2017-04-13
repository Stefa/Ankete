import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Survey} from "../../data/survey.data";

@Component({
    moduleId: module.id,
    selector: 'survey-list',
    templateUrl: 'survey-list.component.html',
    styleUrls: ['survey-list.component.css']
})
export class SurveyListComponent implements OnInit {
    surveys: any;
    sortField: string;
    sortDirection: number = 1;
    showActionColumn: boolean = false;
    constructor(private route: ActivatedRoute, private router: Router,) { }

    ngOnInit() {
        this.surveys = this.route.snapshot.data['surveys'];
    }

    sortByName() {
        this.surveys.sort((survey1: Survey, survey2: Survey) => {
            return this.sortDirection * survey1.name.localeCompare(survey2.name);
        });
    }

    sortByStart() {
        this.surveys.sort((survey1: Survey, survey2: Survey) => {
            return this.sortDirection * (survey1.start.valueOf() - survey2.start.valueOf());
        });
    }

    sortByEnd() {
        this.surveys.sort((survey1: Survey, survey2: Survey) => {
            return this.sortDirection * (survey1.end.valueOf() - survey2.end.valueOf());
        });
    }

    sort(field: string) {
        this.sortDirection = this.sortField == field ?  -this.sortDirection : 1;
        this.sortField = field;
        switch (field) {
            case 'name': { this.sortByName(); break; }
            case 'start':{ this.sortByStart(); break; }
            case 'end':{ this.sortByEnd(); break; }
        }
    }
}
