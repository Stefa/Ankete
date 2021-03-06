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
import {MockActivatedRoute} from "../../test/mock.activated-route";
import {ActivatedRoute} from "@angular/router";
import {userTypes} from "../../data/user.data";
import {QuestionTemplateService} from "../../services/question-template/question-template.service";
import {QuestionTemplateSearchComponent} from "../../components/question-template-search/question-template-search.component";

describe('SurveyForm', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [FormsModule, ReactiveFormsModule, HttpModule, DragulaModule, MyDatePickerModule],
            declarations: [SurveyForm, FormErrorComponent, QuestionForm, QuestionTemplateSearchComponent],
            providers: [
                SurveyService, ApiService, SurveyFormValidator, AuthService, UserService, QuestionService,
                QuestionTemplateService,
                {provide: ActivatedRoute, useClass: MockActivatedRoute}
            ]
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
            newSurvey.questionOrder = [];
        });

        it('should send request to SurveyService::createSurvey on valid submit', inject([SurveyService, AuthService],
            (surveyService: SurveyService, authService: AuthService) => {
                let surveyRequest = Object.assign({}, newTestSurvey);
                delete surveyRequest.id;
                surveyRequest.questionOrder = [];
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
                surveyRequest.questionOrder = [];
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
            required: true,
            answerLabels: ['answer1', 'answer2', 'answer3'],
            author: leonardoUserObject
        };
        let createdQuestion1: Question = Object.assign({id: 1}, newQuestion1);
        let newQuestion2 = {
            type: questionTypes.choose_one,
            text: 'Choose one result?',
            required: false,
            answerLabels: ['result1', 'result2', 'result3'],
            author: leonardoUserObject
        };
        let createdQuestion2: Question = Object.assign({id: 2}, newQuestion2);
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

        function setQuestionSpies(
            questionService: QuestionService,
            authService: AuthService,
            questionTemplateService: QuestionTemplateService,
            returnQuestion
        ) {
            spyOn(questionService, 'createQuestion').and.returnValue(Observable.of(returnQuestion));
            spyOn(authService, 'getLoggedInUser').and.returnValue(leonardoUserObject);

            let returnTemplate = jQuery.extend({}, returnQuestion);
            delete returnTemplate.survey;
            spyOn(questionTemplateService, 'create').and.returnValue(Observable.of(returnTemplate));
        }

        function addQuestion(newQuestion) {
            surveyFormPage.showQuestionForm();
            fixture.detectChanges();
            surveyFormPage.getQuestionFormPage();

            surveyFormPage.questionFormPage.setType(newQuestion.type);
            surveyFormPage.questionFormPage.setText(newQuestion.text);
            fixture.detectChanges();
            surveyFormPage.questionFormPage.getAnswerInput();
            newQuestion.answerLabels.forEach(answer => surveyFormPage.questionFormPage.setAnswer(answer));
            fixture.detectChanges();
            surveyFormPage.questionFormPage.submitForm();
        }

        it('should add question to questions array when question form is submitted', inject(
            [QuestionService, AuthService, QuestionTemplateService],
            (questionService: QuestionService, authService: AuthService, questionTemplateService: QuestionTemplateService) => {
                setQuestionSpies(questionService, authService, questionTemplateService, createdQuestion1);
                addQuestion(newQuestion1);
                expect(fixture.componentInstance.questions[0]).toEqual(createdQuestion1);
            }
        ));

        it('should add two questions to questions array when question form is submitted two times', inject(
            [QuestionService, AuthService, QuestionTemplateService],
            (questionService: QuestionService, authService: AuthService, questionTemplateService: QuestionTemplateService) => {
                spyOn(questionService, 'createQuestion').and.returnValues(
                    Observable.of(createdQuestion1), Observable.of(createdQuestion2)
                );

                let createdTemplate1 = jQuery.extend({}, createdQuestion1);
                delete createdTemplate1.survey;
                let createdTemplate2 = jQuery.extend({}, createdQuestion2);
                delete createdTemplate2.survey;
                spyOn(questionTemplateService, 'create').and.returnValues(
                    Observable.of(createdTemplate1), Observable.of(createdTemplate2)
                );

                spyOn(authService, 'getLoggedInUser').and.returnValue(leonardoUserObject);
                addQuestion(newQuestion1);
                fixture.detectChanges();
                addQuestion(newQuestion2);

                expect(fixture.componentInstance.questions[0]).toEqual(createdQuestion1);
                expect(fixture.componentInstance.questions[1]).toEqual(createdQuestion2);
            }
        ));

        it('should remove question form after successful submit', inject(
            [QuestionService, AuthService, QuestionTemplateService],
            (questionService: QuestionService, authService: AuthService, questionTemplateService: QuestionTemplateService) => {
                setQuestionSpies(questionService, authService, questionTemplateService, createdQuestion1);
                addQuestion(newQuestion1);
                fixture.detectChanges();
                let questionForm = fixture.debugElement.query(By.directive(QuestionForm));
                expect(questionForm == null).toBe(true);
            }
        ));

        it('should enable Add question button after question form is submitted', inject(
            [QuestionService, AuthService, QuestionTemplateService],
            (questionService: QuestionService, authService: AuthService, questionTemplateService: QuestionTemplateService) => {
                setQuestionSpies(questionService, authService, questionTemplateService, createdQuestion1);
                addQuestion(newQuestion1);
                fixture.detectChanges();
                expect(surveyFormPage.addQuestionButton.classes.disabled).toBe(false);
            }
        ));

        it('should create question template after question form is submitted', inject(
            [QuestionService, AuthService, QuestionTemplateService],
            (questionService: QuestionService, authService: AuthService, questionTemplateService: QuestionTemplateService) => {
                setQuestionSpies(questionService, authService, questionTemplateService, createdQuestion1);
                addQuestion(newQuestion1);
                expect(questionTemplateService.create).toHaveBeenCalledWith(newQuestion1);
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
            [SurveyService, AuthService, QuestionService, QuestionTemplateService],
            (
                surveyService: SurveyService,
                authService: AuthService,
                questionService: QuestionService,
                questionTemplateService: QuestionTemplateService
            ) => {
                let newSurvey = Object.assign({}, newTestSurveyFormInput);
                let surveyResponse = Object.assign({}, newTestSurvey);
                let surveyRequest = Object.assign({}, newTestSurvey);
                delete surveyRequest.id;
                surveyRequest.questionOrder = [1,2];

                setSpies(surveyService, surveyResponse, authService);
                spyOn(questionService, 'createQuestion').and.returnValues(
                    Observable.of(createdQuestion1), Observable.of(createdQuestion2)
                );
                let createdTemplate1 = jQuery.extend({}, createdQuestion1);
                let createdTemplate2 = jQuery.extend({}, createdQuestion2);
                spyOn(questionTemplateService, 'create').and.returnValues(
                    Observable.of(createdTemplate1), Observable.of(createdTemplate2)
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

        it('should display error on submit when number of pages is larger than number of questions', inject(
            [SurveyService, AuthService, QuestionService, QuestionTemplateService],
            (
                    surveyService: SurveyService,
                    authService: AuthService,
                    questionService: QuestionService,
                    questionTemplateService: QuestionTemplateService
            ) => {
                let newSurvey = Object.assign({}, newTestSurveyFormInput);
                newSurvey.pages = 3;
                setSpies(surveyService, null, authService);

                spyOn(questionService, 'createQuestion').and.returnValues(
                    Observable.of(createdQuestion1), Observable.of(createdQuestion2)
                );
                let createdTemplate1 = jQuery.extend({}, createdQuestion1);
                let createdTemplate2 = jQuery.extend({}, createdQuestion2);
                spyOn(questionTemplateService, 'create').and.returnValues(
                    Observable.of(createdTemplate1), Observable.of(createdTemplate2)
                );

                addQuestion(newQuestion1);
                fixture.detectChanges();
                addQuestion(newQuestion2);
                fixture.detectChanges();

                submitSurveyForm(newSurvey);
                fixture.detectChanges();
                surveyFormPage.getErrors();

                expect(surveyService.createSurvey).not.toHaveBeenCalled();
                expect(createdSurvey).toBeNull();
                expect(surveyFormPage.tooMuchPagesError.innerHTML).toContain('Broj strana ne može biti veći od broja pitanja.');
            }
        ));

    });

    describe('Survey edit', () => {
        let question1 = {
            id: 2,
            type: questionTypes.choose_multiple,
            text: 'Choose multiple',
            required: false,
            answerLabels: ['choice1', 'choice2', 'choice3'],
            otherAnswer: 'other',
            author: {id: 7},
            survey: {id: 4}
        };
        let question2 = {
            id: 1,
            type: questionTypes.long_text,
            text: 'Enter long text',
            required: false,
            author: {id: 7},
            survey: {id: 4}
        };
        let question3 = {
            id: 3,
            type: questionTypes.numeric,
            text: 'Write numbers',
            required: false,
            answerLabels: ['number1', 'number2', 'number3'],
            author: {id: 7},
            survey: {id: 4}
        };

        let fullSurvey: Survey = {
            id: 4,
            name: 'Survey1',
            start: new Date(2017, 0, 1),
            end: new Date(2020, 0, 1),
            anonymous: true,
            pages: 2,
            author: {
                id: 7,
                type: userTypes.author,
                name: 'Leonardo',
                surname: 'da Vinci',
                username: 'Leo',
                password: 'turtlePower',
                birthday: new Date(1452, 4, 15),
                phone: '161803398',
                email: 'gmail@leo.com'
            },
            questionOrder: [2,1,3],
            questions: [question1, question2, question3],
            blocked: false,
        };

        let fixture;
        let component;
        beforeEach( () => {
            fixture = TestBed.createComponent(SurveyForm);
            component = fixture.componentInstance;
            component.survey = fullSurvey;
            fixture.detectChanges();
        });

        it('should pre-populate fields with survey values', () => {
            expect(component.surveyFormGroup.get('name').value).toBe('Survey1');
            expect(component.surveyFormGroup.get('start').value).toEqual({date: {year: 2017, month: 1, day: 1}});
            expect(component.surveyFormGroup.get('end').value).toEqual({date: {year: 2020, month: 1, day: 1}});
            expect(component.surveyFormGroup.get('anonymous').value).toBe(true);
            expect(component.surveyFormGroup.get('pages').value).toBe(2);
            expect(component.questions).toEqual(fullSurvey.questions);
        });

        it('should update the survey on form submit', inject([SurveyService],
            (surveyService: SurveyService) => {
                let expectedRequest = {
                    name: 'Survey1',
                    start: new Date(2017, 0, 1),
                    end: new Date(2020, 0, 1, 23, 59, 59),
                    anonymous: true,
                    pages: 3,
                    author: {
                        id: 7,
                        type: userTypes.author,
                        name: 'Leonardo',
                        surname: 'da Vinci',
                        username: 'Leo',
                        password: 'turtlePower',
                        birthday: new Date(1452, 4, 15),
                        phone: '161803398',
                        email: 'gmail@leo.com'
                    },
                    questionOrder: [2,1,3]
                };
                fixture.detectChanges();

                spyOn(surveyService, 'updateSurvey').and.returnValue(Observable.of({}));
                let surveyFormPage = new SurveyFormPage(fixture.debugElement);
                surveyFormPage.setPages('3');
                fixture.detectChanges();
                surveyFormPage.submitForm();
                expect(surveyService.updateSurvey).toHaveBeenCalledWith(4, expectedRequest);
            }
        ));
    });

});