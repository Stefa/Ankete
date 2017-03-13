import {async, TestBed, ComponentFixture, inject} from "@angular/core/testing";
import {FormsModule, ReactiveFormsModule, FormGroup} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {DragulaModule} from "ng2-dragula";
import {SurveyForm} from "./survey.form";
import {SurveyService} from "../../services/survey/survey.service";
import {ApiService} from "../../services/api/api.service";
import {By} from "@angular/platform-browser";
import {DebugElement} from "@angular/core";
import {FormErrorComponent} from "../../components/form-error/form-error.component";
import {SurveyFormValidator} from "../../form-validators/survey/survey.form-validator";
import {MyDatePickerModule} from "mydatepicker";
import {SurveyFormPage} from "./survey.form.page";
import {Survey} from "../../data/survey.data";
import {newTestSurveyFormInput, newTestSurvey} from "../../test/surveys";
import {AuthService} from "../../services/authentication/auth.service";
import {Observable} from "rxjs/Rx";
import {leonardoUserObject} from "../../test/users";
import {UserService} from "../../services/user/user.service";
import {QuestionForm} from "../question/question.form";
import {QuestionService} from "../../services/question/question.service";
import {questionTypes, Question} from "../../data/question.data";

describe('SurveyForm', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [FormsModule, ReactiveFormsModule, HttpModule, DragulaModule, MyDatePickerModule],
            declarations: [SurveyForm, FormErrorComponent, QuestionForm],
            providers: [SurveyService, ApiService, SurveyFormValidator, AuthService, UserService, QuestionService]
        })
            .compileComponents();
    }));

    describe('SurveyForm: display', () => {
        let fixture;
        let component;
        beforeEach( () => {
            fixture = TestBed.createComponent(SurveyForm);
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
            expect(component.surveyFormGroup instanceof FormGroup).toBe(true);
        });

        it('should have a name field', () => {
            let nameInput = fixture.debugElement.query(By.css('.survey-name'));
            expect(nameInput instanceof DebugElement).toBe(true);
        });
        it('should have a start field', () => {
            let startInput = fixture.debugElement.query(By.css('.survey-start'));
            expect(startInput instanceof DebugElement).toBe(true);
        });
        it('should have a end field', () => {
            let endInput = fixture.debugElement.query(By.css('.survey-end'));
            expect(endInput instanceof DebugElement).toBe(true);
        });
        it('should have a anonymous field', () => {
            let anonymousInput = fixture.debugElement.query(By.css('.survey-anonymous'));
            expect(anonymousInput instanceof DebugElement).toBe(true);
        });
        it('should have a pages field', () => {
            let pagesInput = fixture.debugElement.query(By.css('.survey-pages'));
            expect(pagesInput instanceof DebugElement).toBe(true);
        });

        it('should show cancel button', () => {
            let cancelButton = fixture.debugElement.query(By.css('.survey-cancel'));
            expect(cancelButton instanceof DebugElement).toBe(true);
        });

        it('should show save button', () => {
            let saveButton = fixture.debugElement.query(By.css('.survey-save'));
            expect(saveButton instanceof DebugElement).toBe(true);
        });

        it('should show Add Question button', () => {
            let addQuestionButton = fixture.debugElement.query(By.css('.survey-add-question'));
            expect(addQuestionButton instanceof DebugElement).toBe(true);
        });
    });

    describe('SurveyForm: behaviour', () => {
        let createdSurvey;
        let fixture: ComponentFixture<SurveyForm>;
        let surveyFormPage: SurveyFormPage;
        let newSurvey;

        function submitSurveyForm(newSurvey: any) {
            surveyFormPage.setName(newSurvey.name);
            surveyFormPage.setStart(newSurvey.start);
            surveyFormPage.setEnd(newSurvey.end);
            if(newSurvey.anonymous) surveyFormPage.setAnonymous();
            surveyFormPage.setPages(newSurvey.pages);

            fixture.detectChanges();
            surveyFormPage.submitForm();
        }

        function setSpies(surveyService: SurveyService, returnSurvey: Survey, authService: AuthService) {
            spyOn(surveyService, 'createSurvey').and.returnValue(Observable.of(returnSurvey));
            spyOn(authService, 'getLoggedInUser').and.returnValue(leonardoUserObject);
        }

        beforeEach(() => {
            createdSurvey = null;
            fixture = TestBed.createComponent(SurveyForm);
            fixture.detectChanges();
            surveyFormPage = new SurveyFormPage(fixture.debugElement);
            fixture.detectChanges();
            fixture.componentInstance.onSurveyCreated.subscribe(
                (survey: Survey) => {
                    createdSurvey = survey;
                }
            );

            newSurvey = Object.assign({}, newTestSurveyFormInput);
            newSurvey.questions = [];
        });

        it('should send request to SurveyService::createSurvey on valid submit', inject([SurveyService, AuthService],
            (surveyService: SurveyService, authService: AuthService) => {
                let surveyRequest = Object.assign({}, newTestSurvey);
                delete surveyRequest.id;
                surveyRequest.questions = [];
                let surveyResponse = Object.assign({}, newTestSurvey);

                setSpies(surveyService, surveyResponse, authService);

                submitSurveyForm(newSurvey);

                expect(authService.getLoggedInUser).toHaveBeenCalled();
                expect(surveyService.createSurvey).toHaveBeenCalledWith(surveyRequest);
                expect(createdSurvey).toEqual(surveyResponse);
            }
        ));

        it('should send request with anonymous survey to SurveyService::createSurvey on valid submit', inject([SurveyService, AuthService],
            (surveyService: SurveyService, authService: AuthService) => {
                let surveyRequest = Object.assign({}, newTestSurvey);
                surveyRequest.anonymous = true;
                delete surveyRequest.id;
                surveyRequest.questions = [];
                let surveyResponse = Object.assign({}, newTestSurvey);
                surveyResponse.anonymous = true;

                setSpies(surveyService, surveyResponse, authService);

                newSurvey.anonymous = true;
                submitSurveyForm(newSurvey);

                expect(authService.getLoggedInUser).toHaveBeenCalled();
                expect(surveyService.createSurvey).toHaveBeenCalledWith(surveyRequest);
                expect(createdSurvey).toEqual(surveyResponse);
            }
        ));

        it('should display error on submit when name field is not populated', inject([SurveyService, AuthService],
            (surveyService: SurveyService, authService: AuthService) => {
                newSurvey.name = '';
                setSpies(surveyService, null, authService);

                submitSurveyForm(newSurvey);
                fixture.detectChanges();
                surveyFormPage.getErrors();

                expect(authService.getLoggedInUser).not.toHaveBeenCalled();
                expect(surveyService.createSurvey).not.toHaveBeenCalled();
                expect(createdSurvey).toEqual(null);
                expect(surveyFormPage.nameMissingErrorElement.innerHTML).toContain('Unesite naziv ankete.');
            }
        ));

        it('should display error on submit when start field is not populated', inject([SurveyService, AuthService],
            (surveyService: SurveyService, authService: AuthService) => {
                newSurvey.start = '';
                setSpies(surveyService, null, authService);

                submitSurveyForm(newSurvey);
                fixture.detectChanges();
                surveyFormPage.getErrors();

                expect(authService.getLoggedInUser).not.toHaveBeenCalled();
                expect(surveyService.createSurvey).not.toHaveBeenCalled();
                expect(createdSurvey).toEqual(null);
                expect(surveyFormPage.startMissingErrorElement.innerHTML).toContain('Unesite datum početka ankete.');
            }
        ));

        it('should display error on submit when end field is not populated', inject([SurveyService, AuthService],
            (surveyService: SurveyService, authService: AuthService) => {
                newSurvey.end = '';
                setSpies(surveyService, null, authService);

                submitSurveyForm(newSurvey);
                fixture.detectChanges();
                surveyFormPage.getErrors();

                expect(authService.getLoggedInUser).not.toHaveBeenCalled();
                expect(surveyService.createSurvey).not.toHaveBeenCalled();
                expect(createdSurvey).toEqual(null);
                expect(surveyFormPage.endMissingErrorElement.innerHTML).toContain('Unesite datum kraja ankete.');
            }
        ));

        it('should display error on submit when end date is before start date', inject([SurveyService, AuthService],
            (surveyService: SurveyService, authService: AuthService) => {
                newSurvey.end = '10.04.2017';
                setSpies(surveyService, null, authService);

                submitSurveyForm(newSurvey);
                fixture.detectChanges();
                surveyFormPage.getErrors();

                expect(authService.getLoggedInUser).not.toHaveBeenCalled();
                expect(surveyService.createSurvey).not.toHaveBeenCalled();
                expect(createdSurvey).toEqual(null);
                expect(surveyFormPage.startAfterEndErrorElement.innerHTML).toContain('Kraj ankete ne može biti pre početka.');
            }
        ));

    });

    describe('Survey questions', () => {
        let fixture: ComponentFixture<SurveyForm>;
        let surveyFormPage: SurveyFormPage;
        let createdSurvey: Survey;
        let newQuestion1 = {
            type: questionTypes.numeric,
            text: 'Test question?',
            answers: ['answer1', 'answer2', 'answer3'],
            author: leonardoUserObject
        };
        let createdQuestion1: Question = Object.assign({id: 1}, newQuestion1);
        let newQuestion2 = {
            type: questionTypes.choose_one,
            text: 'Choose one result?',
            answers: ['result1', 'result2', 'result3'],
            author: leonardoUserObject
        };
        let createdQuestion2: Question = Object.assign({id: 2}, newQuestion2);
        beforeEach(() => {
            fixture = TestBed.createComponent(SurveyForm);
            fixture.detectChanges();
            surveyFormPage = new SurveyFormPage(fixture.debugElement);
            fixture.detectChanges();
            fixture.componentInstance.onSurveyCreated.subscribe(
                (survey: Survey) => {
                    createdSurvey = survey;
                }
            );
        });

        it('should not show question form initially', () => {
            let questionForm = fixture.debugElement.query(By.directive(QuestionForm));
            expect(questionForm == null).toBe(true);
        });

        it('should show question form when Add question button is clicked', () => {
            surveyFormPage.showQuestionForm();
            fixture.detectChanges();
            let questionForm = fixture.debugElement.query(By.directive(QuestionForm));
            expect(questionForm).not.toBeNull();
        });

        it('should disable Add question button after it is clicked', () => {
            expect(surveyFormPage.addQuestionButton.classes.disabled).toBe(false);
            surveyFormPage.showQuestionForm();
            fixture.detectChanges();
            expect(surveyFormPage.addQuestionButton.classes.disabled).toBe(true);
        });

        function setQuestionSpies(questionService, authService, returnQuestion) {
            spyOn(questionService, 'createQuestion').and.returnValue(Observable.of(returnQuestion));
            spyOn(authService, 'getLoggedInUser').and.returnValue(leonardoUserObject);
        }

        function addQuestion(newQuestion) {
            surveyFormPage.showQuestionForm();
            fixture.detectChanges();
            surveyFormPage.getQuestionFormPage();

            surveyFormPage.questionFormPage.setType(newQuestion.type);
            surveyFormPage.questionFormPage.setText(newQuestion.text);
            fixture.detectChanges();
            surveyFormPage.questionFormPage.getAnswerInput();
            newQuestion.answers.forEach(answer => surveyFormPage.questionFormPage.setAnswer(answer));
            fixture.detectChanges();
            surveyFormPage.questionFormPage.submitForm();
        }

        it('should add question to questions array when question form is submitted',
            inject([QuestionService, AuthService],
            (questionService: QuestionService, authService: AuthService) => {
                setQuestionSpies(questionService, authService, createdQuestion1);
                addQuestion(newQuestion1);
                expect(fixture.componentInstance.questions[0]).toEqual(createdQuestion1);
            }
        ));

        it('should add two questions to questions array when question form is submitted two times',
            inject([QuestionService, AuthService],
            (questionService: QuestionService, authService: AuthService) => {
                spyOn(questionService, 'createQuestion').and.returnValues(
                    Observable.of(createdQuestion1), Observable.of(createdQuestion2)
                );
                spyOn(authService, 'getLoggedInUser').and.returnValue(leonardoUserObject);
                addQuestion(newQuestion1);
                fixture.detectChanges();
                addQuestion(newQuestion2);

                expect(fixture.componentInstance.questions[0]).toEqual(createdQuestion1);
                expect(fixture.componentInstance.questions[1]).toEqual(createdQuestion2);
            }
        ));

        it('should remove question form after successful submit', inject([QuestionService, AuthService],
            (questionService: QuestionService, authService: AuthService) => {
                setQuestionSpies(questionService, authService, createdQuestion1);
                addQuestion(newQuestion1);
                fixture.detectChanges();
                let questionForm = fixture.debugElement.query(By.directive(QuestionForm));
                expect(questionForm == null).toBe(true);
            }
        ));

        it('should enable Add question button after question form is submitted', inject([QuestionService, AuthService],
            (questionService: QuestionService, authService: AuthService) => {
                setQuestionSpies(questionService, authService, createdQuestion1);
                addQuestion(newQuestion1);
                fixture.detectChanges();
                expect(surveyFormPage.addQuestionButton.classes.disabled).toBe(false);
            }
        ));

        function cancelQuestionForm() {
            surveyFormPage.showQuestionForm();
            fixture.detectChanges();
            surveyFormPage.getQuestionFormPage();

            surveyFormPage.questionFormPage.cancelForm();
        }
        
        it('should remove question form on cancel', () => {
            cancelQuestionForm();
            fixture.detectChanges();
            let questionForm = fixture.debugElement.query(By.directive(QuestionForm));
            expect(questionForm == null).toBe(true);
        });
        
        it('should not change questions array on cancel', () => {
            cancelQuestionForm();
            fixture.detectChanges();
            expect(fixture.componentInstance.questions.length).toBe(0);
        });
        
        it('should enable Add question button on cancel', () => {
            cancelQuestionForm();
            fixture.detectChanges();
            expect(surveyFormPage.addQuestionButton.classes.disabled).toBe(false);
        });

        function submitSurveyForm(newSurvey: any) {
            surveyFormPage.setName(newSurvey.name);
            surveyFormPage.setStart(newSurvey.start);
            surveyFormPage.setEnd(newSurvey.end);
            if(newSurvey.anonymous) surveyFormPage.setAnonymous();
            surveyFormPage.setPages(newSurvey.pages);

            fixture.detectChanges();
            surveyFormPage.submitForm();
        }

        function setSpies(surveyService: SurveyService, returnSurvey: Survey, authService: AuthService) {
            spyOn(surveyService, 'createSurvey').and.returnValue(Observable.of(returnSurvey));
            spyOn(authService, 'getLoggedInUser').and.returnValue(leonardoUserObject);
        }
        
        it('should update all the questions with surveyId on successful survey form submit', inject(
            [SurveyService, AuthService, QuestionService],
            (surveyService: SurveyService, authService: AuthService, questionService: QuestionService) => {
                let newSurvey = Object.assign({}, newTestSurveyFormInput);
                let surveyResponse = Object.assign({}, newTestSurvey);
                let surveyRequest = Object.assign({}, newTestSurvey);
                delete surveyRequest.id;
                surveyRequest.questions = [1,2];

                setSpies(surveyService, surveyResponse, authService);
                spyOn(questionService, 'createQuestion').and.returnValues(
                    Observable.of(createdQuestion1), Observable.of(createdQuestion2)
                );

                let updatedQuestion1 = Object.assign({survey:{id: 1}}, createdQuestion1);
                let updatedQuestion2 = Object.assign({survey:{id: 1}}, createdQuestion2);

                spyOn(questionService, 'updateSurveyId').and.returnValues(
                    Observable.of(updatedQuestion1), Observable.of(updatedQuestion2)
                );

                addQuestion(newQuestion1);
                fixture.detectChanges();
                addQuestion(newQuestion2);
                fixture.detectChanges();

                submitSurveyForm(newSurvey);
                fixture.detectChanges();

                expect((<any>questionService.updateSurveyId).calls.argsFor(0)).toEqual([1, 1]);
                expect((<any>questionService.updateSurveyId).calls.argsFor(1)).toEqual([2, 1]);

                expect(fixture.componentInstance.questions[0]).toEqual(updatedQuestion1);
                expect(fixture.componentInstance.questions[1]).toEqual(updatedQuestion2);

                expect(surveyService.createSurvey).toHaveBeenCalledWith(surveyRequest);
                expect(createdSurvey).toEqual(surveyResponse);
            }
        ));

    });

});