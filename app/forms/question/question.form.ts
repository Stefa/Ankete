import {Component, OnInit, Output, EventEmitter, OnDestroy, Input} from '@angular/core';
import {FormGroup, AbstractControl, FormBuilder, Validators, FormArray, FormControl} from "@angular/forms";
import {questionTypeTitles, questionTypes, Question} from '../../data/question.data';
import {AuthService} from "../../services/authentication/auth.service";
import {QuestionService} from "../../services/question/question.service";
import {DragulaService} from "ng2-dragula";

@Component({
    moduleId: module.id,
    selector: 'question-form',
    templateUrl: 'question.form.html',
    styleUrls: ['question.form.css']
})
export class QuestionForm implements OnInit, OnDestroy {
    @Input() surveyId: number;

    @Output() onQuestionCreated = new EventEmitter<Question>();
    @Output() onCancel = new EventEmitter();

    questionFormGroup: FormGroup;
    typeControl: AbstractControl;
    textControl: AbstractControl;
    answerControl: AbstractControl;
    formValid: boolean;

    showAnswers: boolean = false;
    answers: Array<string> = [];

    typeOptions: Array<{value:number, name: string}> = [];

    constructor(
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private questionService: QuestionService,
        private dragulaService: DragulaService
    ) {
        dragulaService.setOptions('answers-bag', {
            removeOnSpill: true,
            moves: () => {
                return this.answers.length > 1;
            }
        })
    }

    ngOnInit() {
        this.questionFormGroup = this.formBuilder.group({
            type: ['', Validators.required],
            text: ['', Validators.required],
            answers: ['']
        });
        this.typeControl = this.questionFormGroup.controls['type'];
        this.textControl = this.questionFormGroup.controls['text'];
        this.answerControl = this.questionFormGroup.controls['answers'];
        this.formValid = true;
        questionTypeTitles.forEach((value, key) => {
            this.typeOptions.push({value: key, name: value});
        });
        this.typeControl.valueChanges.subscribe(value => this.showAnswers = value && value!= questionTypes.long_text);
    }

    ngOnDestroy() {
        this.dragulaService.destroy('answers-bag');
    }

    submit(submitValues: any) {
        event.preventDefault();
        this.formValid = this.questionFormGroup.valid;
        if(!this.formValid) {
            return;
        }

        let currentUser = this.authService.getLoggedInUser();
        let newQuestion: Question = {
            type: parseInt(submitValues.type),
            text: submitValues.text,
            answers: this.answers,
            author: currentUser
        };
        if(this.surveyId) {
            newQuestion.survey = {
                id: this.surveyId
            };
        }
        this.questionService.createQuestion(newQuestion)
            .subscribe(createdQuestion => this.onQuestionCreated.emit(createdQuestion));
    }

    addAnswer(event) {
        this.answers.push(this.answerControl.value);
        this.answerControl.reset();
        event.preventDefault();
    }

    shuffleAnswers(event) {
        event.preventDefault();
        for (let i = this.answers.length; i; i--) {
            let j = Math.floor(Math.random() * i);
            [this.answers[i - 1], this.answers[j]] = [this.answers[j], this.answers[i - 1]];
        }
    }

    cancel(event) {
        this.onCancel.emit();
    }
}
