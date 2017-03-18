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
import {FormErrorComponent} from "../../components/form-error/form-error.component";

describe('QuestionForm', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [FormsModule, ReactiveFormsModule, HttpModule, DragulaModule],
            declarations: [QuestionForm, FormErrorComponent],
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
        it('should have a required field', () => {
            let requiredInput = fixture.debugElement.query(By.css('.question-required'));
            expect(requiredInput instanceof DebugElement).toBe(true);
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

        it('should not show "other answer" checkbox if type is not selected', () => {
            fixture.detectChanges();
            let otherAnswerCheckbox = fixture.debugElement.query(By.css('.question-other-answer'));
            expect(otherAnswerCheckbox == null).toBe(true);
        });

        it('should show "other answer" checkbox if type is choose_one or choose_multiple', () => {
            fixture.detectChanges();
            [questionTypes.choose_one, questionTypes.choose_multiple].forEach((type) => {
                fixture.componentInstance.typeControl.setValue(type);
                fixture.detectChanges();
                let otherAnswerCheckbox = fixture.debugElement.query(By.css('.question-other-answer'));
                expect(otherAnswerCheckbox instanceof DebugElement).toBe(true);
            });
        });

        it('should not show "other answer" checkbox if type is numeric, text or long_text', () => {
            fixture.detectChanges();
            [questionTypes.numeric, questionTypes.text, questionTypes.long_text].forEach((type) => {
                fixture.componentInstance.typeControl.setValue(type);
                fixture.detectChanges();
                let otherAnswerCheckbox = fixture.debugElement.query(By.css('.question-other-answer'));
                expect(otherAnswerCheckbox == null).toBe(true);
            });
        });

        it('should not show "other answer" text field if "other answer" checkbox is not checked', () => {
            fixture.detectChanges();
            fixture.componentInstance.typeControl.setValue(questionTypes.choose_multiple);
            fixture.detectChanges();
            let otherAnswerInput = fixture.debugElement.query(By.css('.question-other-answer-text'));
            expect(otherAnswerInput == null).toBe(true);
        });

        it('should show "other answer" text field if "other answer" checkbox is checked', () => {
            fixture.detectChanges();
            fixture.componentInstance.typeControl.setValue(questionTypes.choose_multiple);
            fixture.detectChanges();
            let otherAnswerCheckbox = fixture.debugElement.query(By.css('.question-other-answer')).nativeElement;
            otherAnswerCheckbox.click();
            fixture.detectChanges();
            let otherAnswerInput = fixture.debugElement.query(By.css('.question-other-answer-text'));
            expect(otherAnswerInput instanceof DebugElement).toBe(true);
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

        function fillInQuestionForm(newQuestion: any) {
            questionFormPage.setType(newQuestion.type);
            questionFormPage.setText(newQuestion.text);
            if(newQuestion.required) questionFormPage.setRequired();

            fixture.detectChanges();
            questionFormPage.getAnswerInput();
            newQuestion.answerLabels.forEach(answer => questionFormPage.setAnswer(answer));
            fixture.detectChanges();
        }

        function submitQuestionForm(newQuestion: any) {
            fillInQuestionForm(newQuestion);
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
            expect(fixture.componentInstance.answers[0].text).toBe('answer 1');
            expect(fixture.componentInstance.answers[1].text).toBe('answer 2');
        });

        it('should send request to QuestionService::createQuestion on valid submit', inject([QuestionService, AuthService],
            (questionService: QuestionService, authService: AuthService) => {
                let newQuestion = {
                    type: questionTypes.numeric,
                    text: 'Test question?',
                    required: true,
                    answerLabels: ['answer1', 'answer2', 'answer3'],
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
                    required: true,
                    answerLabels: [],
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
                    required: true,
                    answerLabels: []
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
                    required: true,
                    answerLabels: ['answer1', 'answer2', 'answer3']
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
                    required: true,
                    answerLabels: ['answer1', 'answer2', 'answer3'],
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

        function selectOtherAnswer() {
            fixture.detectChanges();
            questionFormPage.getOtherAnswerCheckbox();
            questionFormPage.setOtherAnswer();
            fixture.detectChanges();
            questionFormPage.getOtherAnswerInput();
        }

        it('should display "other answer" text field with default value prefilled when "other answer" checkbox is checked', () => {
            fixture.detectChanges();
            questionFormPage.setType(questionTypes.choose_one);

            selectOtherAnswer();
            expect(questionFormPage.otherAnswerInput.value).toBe('drugo');
        });

        it('should send value of "other answer" field on submit when populated', inject(
            [QuestionService, AuthService],
            (questionService: QuestionService, authService: AuthService) => {
                let newQuestion = {
                    type: questionTypes.choose_multiple,
                    text: 'Test question?',
                    required: true,
                    answerLabels: ['answer1', 'answer2', 'answer3'],
                    author: leonardoUserObject
                };
                let otherAnswerText = 'Your answer';
                let expectedQuestion: Question = Object.assign(
                    {
                        id: 1,
                        otherAnswer: otherAnswerText
                    }, newQuestion);
                let expectedServiceCall: Question = Object.assign({otherAnswer: otherAnswerText}, newQuestion);

                setSpies(questionService, expectedQuestion, authService);

                fillInQuestionForm(newQuestion);
                selectOtherAnswer();
                questionFormPage.setOtherAnswerText(otherAnswerText);
                questionFormPage.submitForm();

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

        it('should display error that QuestionService throws during question creation', inject(
            [QuestionService, AuthService],
            (questionService: QuestionService, authService: AuthService) => {
                let newQuestion = {
                    type: questionTypes.numeric,
                    text: 'Test question?',
                    required: true,
                    answerLabels: ['answer1', 'answer2', 'answer3'],
                    author: leonardoUserObject
                };
                spyOn(questionService, 'createQuestion').and.throwError('Autor pitanja mora biti postavljen.');
                spyOn(authService, 'getLoggedInUser').and.returnValue(leonardoUserObject);

                submitQuestionForm(newQuestion);
                fixture.detectChanges();
                questionFormPage.getErrors();

                expect(authService.getLoggedInUser).toHaveBeenCalled();
                expect(questionService.createQuestion).toHaveBeenCalledWith(newQuestion);
                expect(createdQuestion).toEqual(null);
                expect(questionFormPage.questionServiceErrorElement.innerHTML).toContain('Autor pitanja mora biti postavljen.');
            }
        ));
    });
});