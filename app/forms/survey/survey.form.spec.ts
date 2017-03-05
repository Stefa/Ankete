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

describe('SurveyForm', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [FormsModule, ReactiveFormsModule, HttpModule, DragulaModule, MyDatePickerModule],
            declarations: [SurveyForm, FormErrorComponent],
            providers: [SurveyService, ApiService, SurveyFormValidator, AuthService, UserService]
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
                surveyResponse.questions = [];

                setSpies(surveyService, surveyResponse, authService);

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

});