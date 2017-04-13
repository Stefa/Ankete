import {SurveyListComponent} from "./survey-list.component";
import {async, ComponentFixture, inject, TestBed} from "@angular/core/testing";
import {MockActivatedRoute} from "../../test/mock.activated-route";
import {ActivatedRoute, Router} from "@angular/router";
import {MockRouter} from "../../test/mock.router";
import {HttpModule} from "@angular/http";
import {MockRouterLinkDirective} from "../../test/mock.router-link";
import {SurveyListPage} from "./survey-list.component.page";

describe('SurveyListComponent', () => {
    let fixture: ComponentFixture<SurveyListComponent>;
    let comp: SurveyListComponent;

    beforeEach( async(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule],
            declarations: [SurveyListComponent, MockRouterLinkDirective],
            providers: [
                {provide: Router, useClass: MockRouter},
                {provide: ActivatedRoute, useClass: MockActivatedRoute}
            ]
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(SurveyListComponent);
                comp    = fixture.componentInstance;
            });
    }));

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
    let allSurveys = [survey1, survey2, survey3];

    function setActivatedRoute(route: MockActivatedRoute) {
        route.testData = {surveys: allSurveys};
    }

    it('should display table with all surveys', inject([ActivatedRoute],
        (route: MockActivatedRoute) => {
            setActivatedRoute(route);
            fixture.detectChanges();
            let page = new SurveyListPage(fixture.debugElement);
            page.getSurveyRows();
            expect(page.surveyRows.length).toBe(3);
            expect(page.surveyRows[0].innerHTML).toContain(survey1.name);
            expect(page.surveyRows[1].innerHTML).toContain(survey2.name);
            expect(page.surveyRows[2].innerHTML).toContain(survey3.name);
        }
    ));

    it('should sort the surveys by name descending after clicking on name header twice', inject([ActivatedRoute],
        (route: MockActivatedRoute) => {
            setActivatedRoute(route);
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

    it('should sort the surveys by start date descending after clicking on start header twice', inject([ActivatedRoute],
        (route: MockActivatedRoute) => {
            setActivatedRoute(route);
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

    it('should sort the surveys by end date descending after clicking on end header twice', inject([ActivatedRoute],
        (route: MockActivatedRoute) => {
            setActivatedRoute(route);
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

});