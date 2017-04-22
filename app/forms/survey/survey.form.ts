import {Component, OnInit, Output, EventEmitter, OnDestroy, Input} from '@angular/core';
import {Survey} from "../../data/survey.data";
import {FormGroup, FormBuilder, Validators, ValidatorFn, FormControl} from "@angular/forms";
import {SurveyService} from "../../services/survey/survey.service";
import {SurveyFormValidator} from "../../form-validators/survey/survey.form-validator";
import * as moment from 'moment/moment';
import {AuthService} from "../../services/authentication/auth.service";
import {Question} from "../../data/question.data";
import {QuestionService} from "../../services/question/question.service";
import {DragulaService} from "ng2-dragula";

@Component({
    moduleId: module.id,
    selector: 'survey-form',
    templateUrl: 'survey.form.html',
    styleUrls: ['survey.form.css']
})
export class SurveyForm implements OnInit, OnDestroy {
    @Output() onSurveyCreated = new EventEmitter<Survey>();
    @Output() onCancel = new EventEmitter();

    surveyFormGroup: FormGroup;
    showQuestionForm: boolean = false;
    questions: Array<Question> = [];
    questionIdsBeforeDelete: Array<number> = [];

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
        private authService: AuthService,
        private questionService: QuestionService,
        private dragulaService: DragulaService
    ) {
        dragulaService.setOptions('questions-bag', {
            removeOnSpill: true,
            moves: () => {
                return this.questions.length > 1;
            }
        });
        dragulaService.remove.subscribe(_ => this.questionIdsBeforeDelete = this.getQuestionIds());

        dragulaService.removeModel.subscribe(_ => {
            this.validatePages();
            this.deleteRemovedQuestions();
        });
    }

    ngOnInit() {
        this.surveyFormGroup = this.formBuilder.group({
            name: ['', Validators.required],
            start: ['', Validators.required],
            end: ['', Validators.required],
            anonymous: [''],
            pages: ['1', this.pagesValidator]
        }, {validator: this.startAfterEndValidator});

        this.formValid = true;
        this.validateForm();
        this.surveyFormGroup.valueChanges.subscribe(_ => this.validateForm());

        this.$surveyFields = jQuery('.survey-fields');
        this.$buttons = jQuery('.survey-buttons');
    }

    ngOnDestroy() {
        this.dragulaService.destroy('questions-bag');
    }

    validateForm() {
        this.formErrors = this.surveyFormValidator.validateForm(this.surveyFormGroup);
    }

    private validatePages() {
        let pagesControl = this.surveyFormGroup.get('pages');
        pagesControl.markAsDirty();
        pagesControl.updateValueAndValidity();
        this.validateForm();
        this.formValid = this.surveyFormGroup.valid;
    }

    private startAfterEndValidator: ValidatorFn = (g: FormGroup) => {
        let startControl = g.get('start');
        let endControl = g.get('end');
        if(startControl.value == "" || endControl.value == "") return null;

        let start = moment(startControl.value.date);
        let end = moment(endControl.value.date);

        return start.isAfter(end) ? {'startAfterEnd': true } : null;
    };

    private pagesValidator: ValidatorFn = (pagesControl: FormControl) => {
        let pages = parseInt(pagesControl.value);
        if(isNaN(pages)) return {'pagesNan': true};

        let maxAllowedPages = this.questions.length > 0 ? this.questions.length : 1;
        if(pages > maxAllowedPages) return {'muchPages': true};
    };

    private deleteRemovedQuestions() {
        let currentQuestions = this.getQuestionIds();
        let questionsToDelete = this.questionIdsBeforeDelete.filter(
            questionId => currentQuestions.indexOf(questionId) == -1
        );
        questionsToDelete.forEach(
            questionId => {
                let idIndex = this.questionIdsBeforeDelete.indexOf(questionId);
                this.questionService.deleteQuestion(questionId).subscribe(
                    deleted => this.questionIdsBeforeDelete.splice(idIndex, 1)
                )
            }
        );
    }

    submit(submitValues: any) {
        this.formValid = this.surveyFormGroup.valid;
        this.markControlsAsDirty();
        this.validateForm();
        if(!this.formValid) return;
        let newSurvey = this.createSurveyFromSubmittedValues(submitValues);
        this.surveyService.createSurvey(newSurvey).subscribe(
            createdSurvey => {
                this.updateSurveyQuestionsWithSurveyId(createdSurvey.id);
                this.onSurveyCreated.emit(createdSurvey);
            }
        )
    }

    private markControlsAsDirty() {
        for (let controlName in this.surveyFormGroup.controls) {
            this.surveyFormGroup.get(controlName).markAsDirty();
        }
    }

    private updateSurveyQuestionsWithSurveyId(surveyId) {
        for(let i=0; i<this.questions.length; i++) {
            let questionId = this.questions[i].id;
            this.questionService.updateSurveyId(questionId, surveyId).subscribe(
                updatedQuestion => this.questions[i] = updatedQuestion
            );
        }
    }

    private createSurveyFromSubmittedValues(submitValues: any): Survey {
        let currentUser = this.authService.getLoggedInUser();
        let anonymous = !!submitValues.anonymous;
        const e = submitValues.end.date;
        let end = new Date(e.year, e.month-1, e.day, 23, 59, 59);
        let questionIds = this.getQuestionIds();
        return {
            name: submitValues.name,
            start: submitValues.start.jsdate,
            end: end,
            anonymous: anonymous,
            pages: submitValues.pages,
            author: currentUser,
            questionOrder: questionIds
        };
    }

    private getQuestionIds() {
        return this.questions.map(question => question.id);
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
        this.validatePages();
    }

    cancelQuestion() {
        this.showQuestionForm = false;
        this.undimSurveyForm();
    }

    shuffleQuestions(event) {
        event.preventDefault();
        for (let i = this.questions.length; i; i--) {
            let j = Math.floor(Math.random() * i);
            [this.questions[i - 1], this.questions[j]] = [this.questions[j], this.questions[i - 1]];
        }
    }

}