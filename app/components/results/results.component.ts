import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Progress} from "../../data/progress.data";
import {Survey} from "../../data/survey.data";
import * as moment from 'moment/moment';

@Component({
    moduleId: module.id,
    selector: 'results',
    templateUrl: 'results.component.html'
})
export class ResultsComponent implements OnInit {
    results: Progress[];
    survey: Survey;
    resultLinks: Array<{data: string, id: number}>;

    constructor(private route: ActivatedRoute) { }

    ngOnInit() {
        this.results = this.route.snapshot.data['results'];
        this.survey = this.route.snapshot.data['survey'];
        this.survey.anonymous ? this.prepareAnonymousLinks() : this.preparePersonalizedLinks();
    }

    private prepareAnonymousLinks() {
        this.resultLinks = this.results.map((result, index) => {
            return {
                data: 'Rezultat '+(index+1),
                id: result.id
            }
        });
    }

    private preparePersonalizedLinks() {
        this.resultLinks = this.results.map((result) => {
            let user: any = ('userData' in result) ? result.userData : result.user;
            let userBirthday = moment(user.birthday).format('DD.MM.YYYY.');
            let linkText = `${user.name} ${user.surname} (${userBirthday})`;
            return {
                data: linkText,
                id: result.id
            }
        });
    }

}