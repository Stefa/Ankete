import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {Survey} from "../../data/survey.data";

@Component({
    moduleId: module.id,
    selector: 'new-survey',
    templateUrl: 'new-survey.component.html'
})
export class NewSurveyComponent implements OnInit {
    survey: Survey;
    constructor(private router: Router) { }

    ngOnInit() {}

    goToMySurveys() {
        this.router.navigate(['/my-surveys']);
    }

}
