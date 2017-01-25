import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {FormGroup, AbstractControl, FormBuilder, Validators, FormArray} from "@angular/forms";
import {questionTypeTitles, questionTypes, Question} from '../../data/question.data';
import {AuthService} from "../../services/authentication/auth.service";
import {QuestionService} from "../../services/question/question.service";

@Component({
    moduleId: module.id,
    selector: 'question-form',
    templateUrl: 'question.form.html',
    styleUrls: ['question.form.css']
})
export class QuestionForm implements OnInit {
    @Output() onQuestionCreated = new EventEmitter<Question>();
    @Output() onCancel = new EventEmitter();

    questionFormGroup: FormGroup;
    typeControl: AbstractControl;
    textControl: AbstractControl;
    answersControl: FormArray;
    formValid: boolean;

    typeOptions: Array<{value:number, name: string}> = [];

    constructor(
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private questionService: QuestionService
    ) {}

    ngOnInit() {
        this.questionFormGroup = this.formBuilder.group({
            type: ['', Validators.required],
            text: ['', Validators.required],
            answers: this.formBuilder.array([
                ['']
            ])
        });
        this.typeControl = this.questionFormGroup.controls['type'];
        this.textControl = this.questionFormGroup.controls['text'];
        this.answersControl = <FormArray>this.questionFormGroup.controls['answers'];
        this.formValid = true;
        questionTypeTitles.forEach((value, key) => {
            this.typeOptions.push({value: key, name: value});
        });
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
            answers: submitValues.answers,
            author: currentUser
        };
        this.questionService.createQuestion(newQuestion)
            .subscribe(createdQuestion => this.onQuestionCreated.emit(createdQuestion));
    }

    addAnswer(event) {
        this.answersControl.push(this.formBuilder.control(''));
        event.preventDefault();
    }

    cancel(event) {
        this.onCancel.emit();
    }
}
