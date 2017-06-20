import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Survey} from "../../data/survey.data";
import {SurveyService} from "../../services/survey/survey.service";
import {AuthService} from "../../services/authentication/auth.service";
import {User, UserPermissions, userTypes} from "../../data/user.data";
import * as moment from 'moment/moment';

@Component({
    moduleId: module.id,
    selector: 'survey-list',
    templateUrl: 'survey-list.component.html',
    styleUrls: ['survey-list.component.css']
})
export class SurveyListComponent implements OnInit, AfterViewInit {
    surveys: any;
    onMySurveysPage: boolean = false;
    sortField: string;
    sortDirection: number = 1;
    showActionColumn: boolean = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private surveyService: SurveyService,
        private authService: AuthService
    ) { }

    ngOnInit() {
        this.surveys = this.route.snapshot.data['surveys'];
        let currentUser = this.authService.getLoggedInUser();
        this.surveys.map(survey => {
            let hasAccessToSurvey = currentUser.type == userTypes.administrator || currentUser.id == survey.author.id;
            survey.canEdit = moment().isBefore(moment(survey.start)) && hasAccessToSurvey;
            survey.canDelete = hasAccessToSurvey;
            survey.canViewResults = hasAccessToSurvey;
            return survey;
        });
        this.onMySurveysPage = this.route.snapshot.data['mySurveys'];
        this.initActionVisibility();
    }

    ngAfterViewInit() {
        jQuery('.buttons .button').popup();
    }

    private initActionVisibility() {
        let currentUser = this.authService.getLoggedInUser();
        let userPermission: UserPermissions = UserPermissions[currentUser.type];

        this.showActionColumn = userPermission >= UserPermissions.clerk;
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

    goToSurveyProxy(surveyId) {
        this.router.navigate(['/survey-proxy', surveyId, 'info']);
    }

    deleteSurvey(surveyId, canDelete) {
        if(!canDelete) return;
        this.surveyService.deleteSurvey(surveyId).subscribe(_ => {
            this.surveys = this.surveys.filter(survey => survey.id != surveyId);
        });
    }

    editSurvey(surveyId) {
        this.router.navigate(['/edit-survey', surveyId]);
    }

    goToSurveyResults(surveyId) {
        this.router.navigate(['/results', surveyId]);
    }
}
