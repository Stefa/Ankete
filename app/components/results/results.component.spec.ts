import {ResultsComponent} from "./results.component";
import {async, ComponentFixture, inject, TestBed} from "@angular/core/testing";
import {leonardoUserObject} from "../../test/users";
import {MockActivatedRoute} from "../../test/mock.activated-route";
import {ActivatedRoute, Router} from "@angular/router";
import {MockRouter} from "../../test/mock.router";
import {Survey} from "../../data/survey.data";
import {questionTypes} from "../../data/question.data";
import {By} from "@angular/platform-browser";
import {HttpModule} from "@angular/http";
import {MockRouterLinkDirective} from "../../test/mock.router-link";

describe('ResultsComponent', () => {
    let fixture: ComponentFixture<ResultsComponent>;
    let comp: ResultsComponent;
    let resultRows: Array<any>;

    beforeEach( async(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule],
            declarations: [ResultsComponent, MockRouterLinkDirective],
            providers: [
                {provide: Router, useClass: MockRouter},
                {provide: ActivatedRoute, useClass: MockActivatedRoute}
            ]
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(ResultsComponent);
                comp    = fixture.componentInstance;
            });
    }));

    let results = [
        {
            survey: {id: 7},
            finished: true,
            id: 1,
            progress: {done: 2, total: 2},
            user: leonardoUserObject
        },
        {
            survey: {id: 7},
            finished: true,
            id: 3,
            progress: {done: 2, total: 2},
            user: leonardoUserObject,
            userData: {
                name: "Arthur",
                surname: "Dent",
                birthday: new Date("1984-03-26T00:00:00.000Z")
            }
        }
    ];

    let question1 = {
        id: 2,
        type: questionTypes.choose_multiple,
        text: 'Choose multiple',
        required: false,
        answerLabels: ['choice1', 'choice2', 'choice3'],
        otherAnswer: 'other',
        author: {id: 7},
        survey: {id: 7}
    };
    let question2 = {
        id: 1,
        type: questionTypes.long_text,
        text: 'Enter long text',
        required: false,
        author: {id: 7},
        survey: {id: 7}
    };

    let survey: Survey = {
        id: 7,
        name: 'Survey1',
        start: new Date(2017, 0, 1),
        end: new Date(2020, 0, 1),
        anonymous: false,
        pages: 2,
        author: leonardoUserObject,
        questionOrder: [2,1],
        questions: [question1, question2],
        blocked: false,
    };

    function setActivatedRoute(route: MockActivatedRoute, dataResults, dataSurvey) {
        route.testData = {
            results: dataResults,
            survey: dataSurvey
        };
    }

    function getResults() {
        resultRows = fixture.debugElement.queryAll(By.css('.result'))
            .map(resultDebugElement => resultDebugElement.nativeElement);
    }

    it('should display table with all results', inject([ActivatedRoute],
        (route: MockActivatedRoute) => {
            setActivatedRoute(route, results, survey);
            fixture.detectChanges();
            getResults();
            expect(resultRows.length).toBe(2);
        }
    ));

    it('should display data of the user who filled out the survey if survey is personalized', inject([ActivatedRoute],
        (route: MockActivatedRoute) => {
            setActivatedRoute(route, results, survey);
            fixture.detectChanges();
            getResults();
            let user1Data = "Leonardo da Vinci (15.04.1452.)";
            let user2Data = "Arthur Dent (26.03.1984.)";
            expect(resultRows[0].innerHTML).toContain(user1Data);
            expect(resultRows[1].innerHTML).toContain(user2Data);
        }
    ));

    it('should display generic title of the result if survey is anonymous', inject([ActivatedRoute],
        (route: MockActivatedRoute) => {
            let anonymousSurvey = $.extend(true, {}, survey);
            anonymousSurvey.anonymous = true;
            setActivatedRoute(route, results, anonymousSurvey);
            fixture.detectChanges();
            getResults();
            let user1Data = "Rezultat 1";
            let user2Data = "Rezultat 2";
            expect(resultRows[0].innerHTML).toContain(user1Data);
            expect(resultRows[1].innerHTML).toContain(user2Data);
        }
    ));
});