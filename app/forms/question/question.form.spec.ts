import { QuestionForm } from './question.form';
import {async, TestBed, ComponentFixture, inject} from "@angular/core/testing";
import {FormsModule, ReactiveFormsModule, FormGroup} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {ApiService} from "../../services/api/api.service";
import {QuestionService} from "../../services/question/question.service";
import {By} from "@angular/platform-browser";
import {DebugElement} from "@angular/core";
import {questionTypeTitles, questionTypes, Question} from "../../data/question.data";
import {QuestionFormPage} from "./question.form.page";
import {AuthService} from "../../services/authentication/auth.service";
import {leonardoUserObject} from "../../test/users";
import {Observable} from 'rxjs/Rx';
import {UserService} from "../../services/user/user.service";
import {DragulaModule} from "ng2-dragula";

describe('QuestionForm', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [FormsModule, ReactiveFormsModule, HttpModule, DragulaModule],
            declarations: [QuestionForm],
            providers: [
                QuestionService, ApiService, AuthService, UserService
            ]
        })
            .compileComponents();
    }));

    describe('QuestionForm: display', () => {
        let fixture;
        let component;
        beforeEach( () => {
            fixture = TestBed.createComponent(QuestionForm);
            component = fixture.componentInstance;
            fixture.detectChanges();
        });

        afterEach(() => {
            fixture = null;
            component = null;
        });

        it('should have a defined component', () => {
            expect(component).toBeDefined();
        });
        it('should create a FormGroup', () => {
            expect(component.questionFormGroup instanceof FormGroup).toBe(true);
        });
        it('should have a type field', () => {
            let typeSelect = fixture.debugElement.query(By.css('.question-type'));
            expect(typeSelect instanceof DebugElement).toBe(true);
        });
        it('should have all question type options in type field', () => {
            fixture.detectChanges();
            let typeSelectOptions = fixture.debugElement.queryAll(By.css('.question-type option'));
            expect(typeSelectOptions.length).toBe(6);
            typeSelectOptions.shift();
            for(let option of typeSelectOptions) {
                let value = option.nativeElement.value;
                let text = option.nativeElement.text;
                expect(questionTypeTitles.get(parseInt(value))).toEqual(text);
            }
        });
        it('should have a text field', () => {
            let textInput = fixture.debugElement.query(By.css('.question-text'));
            expect(textInput instanceof DebugElement).toBe(true);
        });
        it('should not show answer field and Add answer button if type is not selected', () => {
            fixture.detectChanges();
            let answerInput = fixture.debugElement.query(By.css('.question-answer'));
            expect(answerInput == null).toBe(true);
            let addAnswerButton = fixture.debugElement.query(By.css('.add-question-answer'));
            expect(addAnswerButton == null).toBe(true);
        });

        it('should show answers field when type is numeric, text, choose_one or choose_multiple', () => {
            fixture.detectChanges();
            let questionTypesWithAnswers = [
                questionTypes.numeric,
                questionTypes.text,
                questionTypes.choose_one,
                questionTypes.choose_multiple
            ];
            questionTypesWithAnswers.forEach((type) => {
                fixture.componentInstance.typeControl.setValue(type);
                fixture.detectChanges();
                let answerInput = fixture.debugElement.query(By.css('.question-answer'));
                expect(answerInput instanceof DebugElement).toBe(true);
                let addAnswerButton = fixture.debugElement.query(By.css('.add-question-answer'));
                expect(addAnswerButton instanceof DebugElement).toBe(true);
            });
        });

        it('should not show answers field when type is long_text', () => {
            fixture.detectChanges();
            fixture.componentInstance.typeControl.setValue(questionTypes.long_text);
            fixture.detectChanges();
            let answerInput = fixture.debugElement.query(By.css('.question-answer'));
            expect(answerInput == null).toBe(true);
            let addAnswerButton = fixture.debugElement.query(By.css('.add-question-answer'));
            expect(addAnswerButton == null).toBe(true);
        });

        it('should show cancel button', () => {
            let cancelButton = fixture.debugElement.query(By.css('.question-cancel'));
            expect(cancelButton instanceof DebugElement).toBe(true);
        });

        it('should show save button', () => {
            let saveButton = fixture.debugElement.query(By.css('.question-save'));
            expect(saveButton instanceof DebugElement).toBe(true);
        });

    });

    describe('QuestionForm: behaviour', () => {
        let fixture: ComponentFixture<QuestionForm>, questionFormPage: QuestionFormPage, createdQuestion;

        function submitQuestionForm(newQuestion: any) {
            questionFormPage.setType(newQuestion.type);
            questionFormPage.setText(newQuestion.text);

            fixture.detectChanges();
            questionFormPage.getAnswerInput();
            newQuestion.answers.forEach(answer => questionFormPage.setAnswer(answer));
            fixture.detectChanges();

            questionFormPage.submitForm();
        }

        function setSpies(questionService: QuestionService, returnQuestion: Question, authService: AuthService) {
            spyOn(questionService, 'createQuestion').and.returnValue(Observable.of(returnQuestion));
            spyOn(authService, 'getLoggedInUser').and.returnValue(leonardoUserObject);
        }

        beforeEach(() => {
            createdQuestion = null;
            fixture = TestBed.createComponent(QuestionForm);
            questionFormPage = new QuestionFormPage(fixture.debugElement);
            fixture.detectChanges();
            fixture.componentInstance.onQuestionCreated.subscribe(
                (question: Question) => {
                    createdQuestion = question;
                }
            );
        });

        it('should add another answer to the answers list when Add answer button is clicked', () => {
            questionFormPage.setType(questionTypes.numeric);
            fixture.detectChanges();
            questionFormPage.getAnswerInput();
            let numberOfAnswers = fixture.componentInstance.answers.length;

            questionFormPage.setAnswer('answer 1');
            questionFormPage.setAnswer('answer 2');
            fixture.detectChanges();

            let newNumberOfAnswers = fixture.componentInstance.answers.length;
            expect(newNumberOfAnswers).toEqual(numberOfAnswers+2);
            expect(fixture.componentInstance.answers[0]).toBe('answer 1');
            expect(fixture.componentInstance.answers[1]).toBe('answer 2');
        });

        it('should send request to QuestionService::createQuestion on valid submit', inject([QuestionService, AuthService],
            (questionService: QuestionService, authService: AuthService) => {
                let newQuestion = {
                    type: questionTypes.numeric,
                    text: 'Test question?',
                    answers: ['answer1', 'answer2', 'answer3'],
                    author: leonardoUserObject
                };
                let expectedQuestion: Question = Object.assign({id: 1}, newQuestion);
                setSpies(questionService, expectedQuestion, authService);

                submitQuestionForm(newQuestion);

                expect(authService.getLoggedInUser).toHaveBeenCalled();
                expect(questionService.createQuestion).toHaveBeenCalledWith(newQuestion);
                expect(createdQuestion).toEqual(expectedQuestion);
            }
        ));

        it('should send request answer field set to empty array when there are no answers', inject([QuestionService, AuthService],
            (questionService: QuestionService, authService: AuthService) => {
                let newQuestion = {
                    type: questionTypes.numeric,
                    text: 'Test question?',
                    answers: [],
                    author: leonardoUserObject
                };
                let expectedQuestion: Question = Object.assign({id: 1}, newQuestion);
                setSpies(questionService, expectedQuestion, authService);

                submitQuestionForm(newQuestion);

                expect(authService.getLoggedInUser).toHaveBeenCalled();
                expect(questionService.createQuestion).toHaveBeenCalledWith(newQuestion);
                expect(createdQuestion).toEqual(expectedQuestion);
            }
        ));

        it('should display error on submit when type is not selected', inject([QuestionService, AuthService],
            (questionService: QuestionService, authService: AuthService) => {
                let newQuestion = {
                    type: "",
                    text: 'Test question?',
                    answers: []
                };
                setSpies(questionService, null, authService);

                submitQuestionForm(newQuestion);
                fixture.detectChanges();
                questionFormPage.getErrors();

                expect(authService.getLoggedInUser).not.toHaveBeenCalled();
                expect(questionService.createQuestion).not.toHaveBeenCalled();
                expect(createdQuestion).toEqual(null);
                expect(questionFormPage.typeErrorElement.innerHTML).toContain('Izaberite tip pitanja.');
            }
        ));
        it('should display error on submit when text field is not populated', inject([QuestionService, AuthService],
            (questionService: QuestionService, authService: AuthService) => {
                let newQuestion = {
                    type: questionTypes.numeric,
                    text: '',
                    answers: ['answer1', 'answer2', 'answer3']
                };
                setSpies(questionService, null, authService);

                submitQuestionForm(newQuestion);
                fixture.detectChanges();
                questionFormPage.getErrors();

                expect(authService.getLoggedInUser).not.toHaveBeenCalled();
                expect(questionService.createQuestion).not.toHaveBeenCalled();
                expect(createdQuestion).toEqual(null);
                expect(questionFormPage.textErrorElement.innerHTML).toContain('Unesite tekst pitanja.');
            }
        ));

        it('should send request with surveyId to QuestionService::createQuestion if surveyId was provided as input',
            inject([QuestionService, AuthService],
            (questionService: QuestionService, authService: AuthService) => {
                let surveyId = 1;
                let newQuestion = {
                    type: questionTypes.numeric,
                    text: 'Test question?',
                    answers: ['answer1', 'answer2', 'answer3'],
                    author: leonardoUserObject
                };
                let expectedQuestion: Question = Object.assign(
                    {
                        id: 1,
                        survey: {id: surveyId}
                    }, newQuestion);
                let expectedServiceCall: Question = Object.assign({survey: {id: surveyId}}, newQuestion);

                fixture.componentInstance.surveyId = surveyId;
                setSpies(questionService, expectedQuestion, authService);

                submitQuestionForm(newQuestion);

                expect(authService.getLoggedInUser).toHaveBeenCalled();
                expect(questionService.createQuestion).toHaveBeenCalledWith(expectedServiceCall);
                expect(createdQuestion).toEqual(expectedQuestion);
            }
        ));

        it('should emmit cancel event when cancel button is clicked', () => {
            let canceled = false;
            fixture.componentInstance.onCancel.subscribe(() => canceled = true);

            questionFormPage.cancelForm();
            expect(canceled).toBe(true);
        });

    });
});