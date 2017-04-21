import {SurveyListComponent} from "./survey-list.component";
import {async, ComponentFixture, inject, TestBed} from "@angular/core/testing";
import {MockActivatedRoute} from "../../test/mock.activated-route";
import {ActivatedRoute, Router} from "@angular/router";
import {MockRouter} from "../../test/mock.router";
import {HttpModule} from "@angular/http";
import {MockRouterLinkDirective} from "../../test/mock.router-link";
import {SurveyListPage} from "./survey-list.component.page";
import {By} from "@angular/platform-browser";
import {SurveyService} from "../../services/survey/survey.service";
import {Observable} from "rxjs/Rx";
import {ApiService} from "../../services/api/api.service";
import {QuestionService} from "../../services/question/question.service";
import {AuthService} from "../../services/authentication/auth.service";
import {UserService} from "../../services/user/user.service";
import {leonardoUserObject} from "../../test/users";

describe('SurveyListComponent', () => {
    let fixture: ComponentFixture<SurveyListComponent>;
    let comp: SurveyListComponent;

    let survey1 = {
        name: "Survey 1",
        start: new Date(2017,3,16),
        end: new Date(2017,4,20),
        anonymous: false,
        pages: 1,
        userId: 1,
        questionOrder: [56, 57],
        id: 7
    };
    let survey2 = {
        name: "Survey 2",
        start: new Date(2017,4,16),
        end: new Date(2017,5,20),
        anonymous: true,
        pages: 2,
        userId: 1,
        questionOrder: [25, 26, 27],
        id: 9
    };
    let survey3 = {
        name: "Survey 3",
        start: new Date(2017,6,16),
        end: new Date(2017,7,20),
        anonymous: false,
        pages: 3,
        userId: 1,
        questionOrder: [5, 6, 7, 8, 9],
        id: 6,
        blocked: false
    };
    let allSurveys;

    beforeEach( async(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule],
            declarations: [SurveyListComponent, MockRouterLinkDirective],
            providers: [
                SurveyService, QuestionService, ApiService, AuthService, UserService,
                {provide: Router, useClass: MockRouter},
                {provide: ActivatedRoute, useClass: MockActivatedRoute}
            ]
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(SurveyListComponent);
                comp    = fixture.componentInstance;
                allSurveys = [survey1, survey2, survey3];
            });
    }));


    function setActivatedRoute(route: MockActivatedRoute) {
        route.testData = {surveys: allSurveys};
    }

    it('should display table with all surveys', inject([ActivatedRoute, AuthService, AuthService],
        (route: MockActivatedRoute, authService: AuthService) => {
            setActivatedRoute(route);
            spyOn(authService, 'getLoggedInUser').and.returnValue(leonardoUserObject);
            fixture.detectChanges();
            let page = new SurveyListPage(fixture.debugElement);
            page.getSurveyRows();
            expect(page.surveyRows.length).toBe(3);
            expect(page.surveyRows[0].innerHTML).toContain(survey1.name);
            expect(page.surveyRows[1].innerHTML).toContain(survey2.name);
            expect(page.surveyRows[2].innerHTML).toContain(survey3.name);
        }
    ));

    it('should sort the surveys by name descending after clicking on name header twice', inject([ActivatedRoute, AuthService],
        (route: MockActivatedRoute, authService: AuthService) => {
            setActivatedRoute(route);
            spyOn(authService, 'getLoggedInUser').and.returnValue(leonardoUserObject);
            fixture.detectChanges();
            let page = new SurveyListPage(fixture.debugElement);
            page.sortByName();
            page.sortByName();
            fixture.detectChanges();
            expect(comp.surveys[0]).toEqual(survey3);
            expect(comp.surveys[1]).toEqual(survey2);
            expect(comp.surveys[2]).toEqual(survey1);
        }
    ));

    it('should sort the surveys by start date descending after clicking on start header twice', inject([ActivatedRoute, AuthService],
        (route: MockActivatedRoute, authService: AuthService) => {
            setActivatedRoute(route);
            spyOn(authService, 'getLoggedInUser').and.returnValue(leonardoUserObject);
            fixture.detectChanges();
            let page = new SurveyListPage(fixture.debugElement);
            page.sortByStart();
            page.sortByStart();
            fixture.detectChanges();
            expect(comp.surveys[0]).toEqual(survey3);
            expect(comp.surveys[1]).toEqual(survey2);
            expect(comp.surveys[2]).toEqual(survey1);
        }
    ));

    it('should sort the surveys by end date descending after clicking on end header twice', inject([ActivatedRoute, AuthService],
        (route: MockActivatedRoute, authService: AuthService) => {
            setActivatedRoute(route);
            spyOn(authService, 'getLoggedInUser').and.returnValue(leonardoUserObject);
            fixture.detectChanges();
            let page = new SurveyListPage(fixture.debugElement);
            page.sortByEnd();
            page.sortByEnd();
            fixture.detectChanges();
            expect(comp.surveys[0]).toEqual(survey3);
            expect(comp.surveys[1]).toEqual(survey2);
            expect(comp.surveys[2]).toEqual(survey1);
        }
    ));

    describe('deleteSurvey', () => {
        it("should call SurveyService's deleteSurvey method", inject([ActivatedRoute, AuthService, SurveyService],
            (route: MockActivatedRoute, authService: AuthService, surveyService: SurveyService) => {
                spyOn(surveyService, 'deleteSurvey').and.returnValue(Observable.of(true));
                spyOn(authService, 'getLoggedInUser').and.returnValue(leonardoUserObject);

                setActivatedRoute(route);
                fixture.detectChanges();

                let page = new SurveyListPage(fixture.debugElement);
                page.getSurveyRowsDebugElements();

                let surveyRow1 = page.surveyRowsDebugElements[0];
                let deleteButton = surveyRow1.query(By.css('.delete'));
                deleteButton.triggerEventHandler('click', event);

                expect(surveyService.deleteSurvey).toHaveBeenCalledWith(7);
            }
        ));

        it('should remove survey from the list after successful delete', inject([ActivatedRoute, AuthService, SurveyService],
            (route: MockActivatedRoute, authService: AuthService, surveyService: SurveyService) => {
                spyOn(surveyService, 'deleteSurvey').and.returnValue(Observable.of(true));
                spyOn(authService, 'getLoggedInUser').and.returnValue(leonardoUserObject);

                setActivatedRoute(route);
                fixture.detectChanges();

                let page = new SurveyListPage(fixture.debugElement);
                page.getSurveyRowsDebugElements();

                let surveyRow1 = page.surveyRowsDebugElements[0];
                let deleteButton = surveyRow1.query(By.css('.delete'));
                deleteButton.triggerEventHandler('click', event);
                fixture.detectChanges();

                expect(comp.surveys.length).toBe(2);
            }
        ));
    });

});