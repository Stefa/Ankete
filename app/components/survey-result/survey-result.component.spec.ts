import {SurveyResultComponent} from "./survey-result.component";
import {async, ComponentFixture, inject, TestBed} from "@angular/core/testing";
import {Progress} from "../../data/progress.data";
import {Survey} from "../../data/survey.data";
import {questionTypes} from "../../data/question.data";
import {userTypes} from "../../data/user.data";
import {MockActivatedRoute} from "../../test/mock.activated-route";
import {ActivatedRoute, Router} from "@angular/router";
import {MockRouter} from "../../test/mock.router";
import {By} from "@angular/platform-browser";
import {AnswerComponent} from "../answer/answer.component";
import {NumericAnswerComponent} from "../survey-result-answers/numeric-answer/numeric-answer.component";
import {TextAnswerComponent} from "../survey-result-answers/text-answer/text-answer.component";
import {LongTextAnswerComponent} from "../survey-result-answers/long-text-answer/long-text-answer.component";
import {ChooseOneAnswerComponent} from "../survey-result-answers/choose-one-answer/choose-one-answer.component";
import {ChooseMultipleAnswerComponent} from "../survey-result-answers/choose-multiple-answer/choose-multiple-answer.component";

describe('SurveyResultComponent', () => {
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

    let answer1 = {
        id: 14,
        progress: {id: 9},
        question: {id: 2},
        answers: [0,2],
        userAnswer: 'my choice'
    };
    let answer2 = {
        id: 15,
        progress: {id: 9},
        question: {id: 1},
        answers: 'Very long text',
    };

    let fullProgress: Progress = {
        id: 9,
        survey: {id: 4},
        user: {id: 12},
        finished: false,
        progress: {done: 1, total: 3},
        answers: [answer1, answer2]
    };

    let fixture: ComponentFixture<SurveyResultComponent>;
    let comp: SurveyResultComponent;

    beforeEach( async(() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [
                SurveyResultComponent,
                AnswerComponent,
                NumericAnswerComponent,
                TextAnswerComponent,
                LongTextAnswerComponent,
                ChooseOneAnswerComponent,
                ChooseMultipleAnswerComponent
            ],
            providers: [
                {provide: Router, useClass: MockRouter},
                {provide: ActivatedRoute, useClass: MockActivatedRoute}
            ]
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(SurveyResultComponent);
                comp    = fixture.componentInstance;
            });
    }));

    function setActivatedRoute(route: MockActivatedRoute) {
        let routeData:any = {
            survey: fullSurvey,
            progress: fullProgress,
        };

        route.testData = routeData;
    }

    it('should prepare question-answer pairs for display', inject([ActivatedRoute],
        (route: MockActivatedRoute) => {
            setActivatedRoute(route);
            fixture.detectChanges();
            let allAnswers: any = [
                {question: question1, answer: answer1},
                {question: question2, answer: answer2},
                {question: question3, answer: undefined},
            ];
            expect(comp.allAnswers).toEqual(allAnswers);
        }
    ));

    it('should display three answer components given three questions', inject([ActivatedRoute],
        (route: MockActivatedRoute) => {
            setActivatedRoute(route);
            fixture.detectChanges();

            let answerComponents = fixture.debugElement.queryAll(By.directive(AnswerComponent));
            expect(answerComponents.length).toBe(3);
        }
    ));

});