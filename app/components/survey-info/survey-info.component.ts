import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Survey} from "../../data/survey.data";
import {Progress, UserData} from "../../data/progress.data";
import * as moment from 'moment/moment';
import {ProgressService} from "../../services/progress/progress.service";
import {AuthService} from "../../services/authentication/auth.service";

@Component({
    moduleId: module.id,
    selector: 'survey-info',
    templateUrl: 'survey-info.component.html'
})
export class SurveyInfoComponent implements OnInit {
    surveyId;
    survey: Survey;
    progress: Progress;
    proxy;

    startButtonLabel: string;
    startButtonActive: boolean;
    answersButtonActive: boolean;
    lockButtonActive: boolean;
    showUserDataForm: boolean;
    userDataInvalid: boolean = false;

    start: string;
    end: string;

    userData: any = {
        name: '',
        surname: '',
        birthday: null
    };

    private myDatePickerOptions = {
        dateFormat: 'dd.mm.yyyy',
        editableDateField: true,
        dayLabels: {
            mo: 'Pon', tu: 'Uto', we: 'Sre', th: 'Čet', fr: 'Pet', sa: 'Sub', su: 'Ned'
        },
        monthLabels: {
            1: 'Jan', 2: 'Feb', 3: 'Mar', 4: 'Apr', 5: 'Maj', 6: 'Jun',
            7: 'Jul', 8: 'Avg', 9: 'Sep', 10: 'Okt', 11: 'Nov', 12: 'Dec'
        },
        minYear: 1900,
        todayBtnTxt: 'Danas',
        openSelectorOnInputClick: true
    };
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private progressService: ProgressService,
        private authService: AuthService
    ) { }

    ngOnInit() {
        this.surveyId = this.route.snapshot.params['surveyId'];
        this.survey = this.route.snapshot.data['survey'];
        this.progress = this.route.snapshot.data['progress'];
        this.proxy = this.route.snapshot.data['proxy'];

        this.configureProgressBar();
        this.prepareStartButton();
        this.prepareAnswersButton();
        this.prepareLockButton();

        this.showUserDataForm = this.proxy && !this.survey.anonymous;

        this.start = moment(this.survey.start).format("D. M. YYYY.");
        this.end = moment(this.survey.end).format("D. M. YYYY.");
    }

    private configureProgressBar() {
        let totalQuestions = this.progress != null ? this.progress.progress.total : this.survey.questions.length;
        let doneQuestions = this.progress != null ? this.progress.progress.done : 0;

        jQuery('#survey-progress')
            .progress({
                value: doneQuestions,
                total: totalQuestions,
                text: {
                    active  : 'Odgovoreno na {value} od {total} pitanja',
                    success : 'Odgovoreno na sva pitanja',
                    ratio: doneQuestions > 0 ? '{value} od {total}' : ''
                },
                label: 'ratio',
                showActivity: false
            });
    }

    private prepareStartButton() {
        let surveyStart = moment(this.survey.start);
        let surveyEnd = moment(this.survey.end);
        let surveyInProgress = moment().isBetween(surveyStart, surveyEnd);

        this.startButtonActive = surveyInProgress && !this.isSurveyLocked();

        this.startButtonLabel = (this.progress != null && this.progress.progress.done > 0) ? 'Nastavi' : 'Popuni';
    }

    private prepareAnswersButton() {
        this.answersButtonActive = this.progress != null && this.progress.progress.done > 0
    }

    private prepareLockButton() {
        let requiredQuestions = this.survey.questions.filter(question => question.required);
        let answers = this.progress != null ? this.progress.answers : [];
        let answeredQuestionIds = answers.map(answer => answer.question.id);
        this.lockButtonActive = requiredQuestions.every(question => answeredQuestionIds.indexOf(question.id) != -1);
    }

    private isSurveyLocked(): boolean {
        if(this.progress == null) return false;
        return ('finished' in this.progress) && this.progress.finished;
    }

    public fillOutSurvey() {
        if(!this.validateUserData()) return;

        if(this.proxy || this.progress == null) {
            this.navigateToFillOutPageAfterCreatingProgress();
            return;
        }
        this.router.navigate(['../fill-out'], { relativeTo: this.route });
    }

    private validateUserData() {
        if(!this.showUserDataForm) return true;
        if(this.userData.name == "" || this.userData.surname == "" ||
            this.userData.birthday == "" || this.userData.birthday == null) {
            this.userDataInvalid = true;
            return false;
        }
        return true;
    }

    private navigateToFillOutPageAfterCreatingProgress() {
        let newProgress = this.createProgressObject();

        this.progressService.createProgress(newProgress).subscribe((progress: any) => {
            let routeParams = ['../fill-out'];
            if(this.proxy) routeParams.push(progress.id);
            this.router.navigate(routeParams, { relativeTo: this.route })
        });
    }

    private createProgressObject(): Progress {
        let me = this.authService.getLoggedInUser();
        let newProgress: Progress =  {
            survey: this.survey,
            user: me,
            progress: {done: 0, total: this.survey.questions.length},
            answers: [],
            finished: false
        };

        if(this.proxy)
            newProgress.userData = this.createUserDataObject();

        return newProgress;
    }

    private createUserDataObject() {
        if(this.survey.anonymous) {
            return "anonymous";
        }

        return {
            name: this.userData.name,
            surname: this.userData.surname,
            birthday: this.userData.birthday.jsdate
        }
    }

    public surveyResults() {
        this.router.navigate(['../result'], { relativeTo: this.route });
    }

    public lockSurvey() {
        this.progressService.setFinished(this.progress.id).subscribe(
            _ => this.lockButtonActive = false
        );
    }

}
