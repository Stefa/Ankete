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
    questionServiceError: {css: string, message: string};

    showAnswers: boolean = false;
    showOtherAnswer: boolean = false;
    answers: Array<{id: number, text: string}> = [];
    currentAnswerId: number = 1;

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
        });
    }

    ngOnInit() {
        const otherAnswerDefaultText = 'drugo';
        this.questionFormGroup = this.formBuilder.group({
            type: ['', Validators.required],
            text: ['', Validators.required],
            required: [''],
            answers: [''],
            otherAnswer: [''],
            otherAnswerText: [otherAnswerDefaultText]
        });
        this.typeControl = this.questionFormGroup.controls['type'];
        this.textControl = this.questionFormGroup.controls['text'];
        this.answerControl = this.questionFormGroup.controls['answers'];
        this.formValid = true;
        questionTypeTitles.forEach((value, key) => {
            this.typeOptions.push({value: key, name: value});
        });
        this.typeControl.valueChanges.subscribe(value => {
            this.showAnswers = value && value!= questionTypes.long_text;
            this.showOtherAnswer = value && (value == questionTypes.choose_one || value == questionTypes.choose_multiple);
        });
        this.questionFormGroup.valueChanges.subscribe(value => {
            if(this.questionServiceError != null) {
                this.questionServiceError = null;
                this.formValid = true;
            }
        })
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
        let answers = this.answers.map(answer => answer.text);

        let currentUser = this.authService.getLoggedInUser();
        let newQuestion: Question = {
            type: parseInt(submitValues.type),
            text: submitValues.text,
            required: !!submitValues.required,
            answerLabels: answers,
            author: currentUser
        };
        if(this.surveyId) {
            newQuestion.survey = {
                id: this.surveyId
            };
        }
        if(submitValues.otherAnswer) {
            newQuestion.otherAnswer = submitValues.otherAnswerText;
        }

        try{
            this.questionService.createQuestion(newQuestion)
                .subscribe(createdQuestion => this.onQuestionCreated.emit(createdQuestion));
        } catch (createError) {
            this.formValid = false;
            this.questionServiceError = {
                css: 'question-service-error',
                message: createError.message
            }
        }

    }

    addAnswer(event) {
        let newAnswer = {
            id: ++this.currentAnswerId,
            text: this.answerControl.value
        };
        this.answers.push(newAnswer);
        this.answerControl.reset();
        this.answerControl.setValue('');
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
