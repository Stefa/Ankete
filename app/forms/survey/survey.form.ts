import {Component, OnInit, Output, EventEmitter, OnDestroy, Input} from '@angular/core';
import {Survey} from "../../data/survey.data";
import {FormGroup, FormBuilder, Validators, ValidatorFn} from "@angular/forms";
import {SurveyService} from "../../services/survey/survey.service";
import {SurveyFormValidator} from "../../form-validators/survey/survey.form-validator";
import * as moment from 'moment/moment';
import {AuthService} from "../../services/authentication/auth.service";
import {Question} from "../../data/question.data";

@Component({
    moduleId: module.id,
    selector: 'survey-form',
    templateUrl: 'survey.form.html',
    styleUrls: ['survey.form.css']
})
export class SurveyForm implements OnInit {
    @Output() onSurveyCreated = new EventEmitter<Survey>();
    @Output() onCancel = new EventEmitter();

    surveyFormGroup: FormGroup;
    showQuestionForm: boolean = false;
    questions: Array<Question> = [];

    formValid: boolean;
    formErrors: any;

    $surveyFields: JQuery;
    $buttons: JQuery;

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
        minYear: 2015,
        todayBtnTxt: 'Danas',
        openSelectorOnInputClick: true
    };

    constructor(
        private formBuilder: FormBuilder,
        private surveyService: SurveyService,
        private surveyFormValidator: SurveyFormValidator,
        private authService: AuthService
    ) { }

    ngOnInit() {
        this.surveyFormGroup = this.formBuilder.group({
            name: ['', Validators.required],
            start: ['', Validators.required],
            end: ['', Validators.required],
            anonymous: [''],
            pages: ['1']
        }, {validator: this.startAfterEndValidator});

        this.formValid = true;
        this.validateForm();
        this.surveyFormGroup.valueChanges.subscribe(_ => this.validateForm());

        this.$surveyFields = jQuery('.survey-fields');
        this.$buttons = jQuery('.survey-buttons');
    }

    validateForm() {
        this.formErrors = this.surveyFormValidator.validateForm(this.surveyFormGroup);
    }

    private startAfterEndValidator: ValidatorFn = (g: FormGroup) => {
        let startControl = g.get('start');
        let endControl = g.get('end');
        if(startControl.value == "" || endControl.value == "") return null;

        let start = moment(startControl.value.date);
        let end = moment(endControl.value.date);

        return start.isAfter(end) ? {'startAfterEnd': true } : null;
    };

    submit(submitValues: any) {
        this.formValid = this.surveyFormGroup.valid;
        this.validateForm();
        if(!this.formValid) return;

        let newSurvey = this.createSurveyFromSubmittedValues(submitValues);

        this.surveyService.createSurvey(newSurvey).subscribe(
            createdSurvey => this.onSurveyCreated.emit(createdSurvey)
        )
    }

    private createSurveyFromSubmittedValues(submitValues: any): Survey {
        let currentUser = this.authService.getLoggedInUser();
        let anonymous = !!submitValues.anonymousInput;
        const e = submitValues.end.date;
        let end = new Date(e.year, e.month-1, e.day, 23, 59, 59);
        return {
            name: submitValues.name,
            start: submitValues.start.jsdate,
            end: end,
            anonymous: anonymous,
            pages: submitValues.pages,
            author: currentUser
        };
    }

    cancel() {
        this.onCancel.emit();
    }

    addQuestionForm(event) {
        if(this.showQuestionForm) return;
        this.showQuestionForm = true;
        this.dimSurveyForm();
        event.preventDefault();
    }

    private dimSurveyForm() {
        this.$surveyFields.dimmer({closable: false});
        this.$surveyFields.dimmer('show');

        this.$buttons.dimmer({closable: false});
        this.$buttons.dimmer('show');
    }
    private undimSurveyForm() {
        this.$surveyFields.dimmer('hide');
        this.$buttons.dimmer('hide');
    }

    addQuestion(question: Question) {
        this.questions.push(question);
        this.showQuestionForm = false;
        this.undimSurveyForm();
    }

    cancelQuestion() {
        this.showQuestionForm = false;
        this.undimSurveyForm();
    }

}