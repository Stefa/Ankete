import {Survey} from "../../data/survey.data";
import {userTypes} from "../../data/user.data";
import {questionTypes} from "../../data/question.data";
import {Progress} from "../../data/progress.data";
import {SurveyFillOutComponent} from "./survey-fill-out.component";
import {async, ComponentFixture, inject, TestBed} from "@angular/core/testing";
import {MockActivatedRoute} from "../../test/mock.activated-route";
import {ActivatedRoute, Router} from "@angular/router";
import {By} from "@angular/platform-browser";
import {QuestionComponent} from "../question/question.component";
import {QuestionPagerComponent} from "../question-pager/question-pager.component";
import {NumericQuestionForm} from "../../forms/survey-fill-out/numeric-question/numeric-question.form";
import {LongTextQuestionForm} from "../../forms/survey-fill-out/long-text-question/long-text-question.form";
import {ChooseOneQuestionForm} from "../../forms/survey-fill-out/choose-one-question/choose-one-question.form";
import {ChooseMultipleQuestionForm} from "../../forms/survey-fill-out/choose-multiple-question/choose-multiple-question.form";
import {TextQuestionForm} from "../../forms/survey-fill-out/text-question/text-question.form";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AnswerService} from "../../services/answer/answer.service";
import {ApiService} from "../../services/api/api.service";
import {HttpModule} from "@angular/http";
import {DebugElement} from "@angular/core";
import {QuestionPagerComponentPage} from "../question-pager/question-pager.component.page";
import {Observable} from "rxjs/Observable";
import {MockRouter} from "../../test/mock.router";
import {ProgressService} from "../../services/progress/progress.service";
describe('SurveyFillOutComponent', () => {
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
        progress: {done: 2, total: 3},
        answers: [answer1, answer2]
    };

    let fixture: ComponentFixture<SurveyFillOutComponent>;
    let comp: SurveyFillOutComponent;

    beforeEach( async(() => {
        TestBed.configureTestingModule({
            imports: [FormsModule, ReactiveFormsModule, HttpModule],
            declarations: [
                SurveyFillOutComponent, QuestionComponent, QuestionPagerComponent,
                NumericQuestionForm, TextQuestionForm, LongTextQuestionForm, ChooseOneQuestionForm, ChooseMultipleQuestionForm
            ],
            providers: [
                AnswerService, ApiService, ProgressService,
                {provide: Router, useClass: MockRouter},
                {provide: ActivatedRoute, useClass: MockActivatedRoute}
            ]
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(SurveyFillOutComponent);
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

    describe('First page', () => {
        it('should display two questions when there are three questions in total and two pages', inject([ActivatedRoute],
            (route: MockActivatedRoute) => {
                setActivatedRoute(route);
                fixture.detectChanges();
                let questions = fixture.debugElement.queryAll(By.directive(QuestionComponent));
                expect(questions.length).toBe(2);
            }
        ));

        it('should display question form according to question type', inject([ActivatedRoute],
            (route: MockActivatedRoute) => {
                setActivatedRoute(route);
                fixture.detectChanges();
                let questions = fixture.debugElement.queryAll(By.directive(QuestionComponent));

                let chooseMultipleQuestion = questions[0].query(By.directive(ChooseMultipleQuestionForm));
                expect(chooseMultipleQuestion instanceof DebugElement).toBe(true);
                let undefinedNumericQuestion = questions[0].query(By.directive(NumericQuestionForm));
                expect(undefinedNumericQuestion).toBeNull();

                let longTextQuestion = questions[1].query(By.directive(LongTextQuestionForm));
                expect(longTextQuestion instanceof DebugElement).toBe(true)
            }
        ));
        
        it('should provide appropriate question and answer objects to the question forms', inject([ActivatedRoute],
            (route: MockActivatedRoute) => {
                setActivatedRoute(route);
                fixture.detectChanges();
                let questions = fixture.debugElement.queryAll(By.directive(QuestionComponent));

                let question1Instance = questions[0].componentInstance;
                expect(question1Instance.question).toEqual(question1);
                expect(question1Instance.answer).toEqual(answer1);

                let question2Instance = questions[1].componentInstance;
                expect(question2Instance.question).toEqual(question2);
                expect(question2Instance.answer).toEqual(answer2);
            }
        ));
    });

    describe('Page change', () => {
        it('should persist answers from the current page if they were changed', inject([ActivatedRoute],
            (route: MockActivatedRoute) => {
                setActivatedRoute(route);
                fixture.detectChanges();

                let questions = fixture.debugElement.queryAll(By.directive(QuestionComponent));
                let question1Instance: QuestionComponent = questions[0].componentInstance;
                let question2Instance: QuestionComponent = questions[1].componentInstance;

                expect(comp.allAnswers.get(1)).toEqual(answer2);

                let answer2a = {
                    id: 15,
                    progress: {id: 9},
                    question: {id: 1},
                    answers: 'Very very very long text',
                };

                spyOn(question1Instance, 'updateQuestionAnswer').and.returnValue(Observable.of(null));
                spyOn(question2Instance, 'updateQuestionAnswer').and.returnValue(Observable.of(answer2a));

                let pager = fixture.debugElement.query(By.directive(QuestionPagerComponent));
                let pagerPage = new QuestionPagerComponentPage(pager);
                pagerPage.next();

                expect(question1Instance.updateQuestionAnswer).toHaveBeenCalled();
                expect(question2Instance.updateQuestionAnswer).toHaveBeenCalled();
                expect(comp.allAnswers.get(1)).toEqual(answer2a);
            }
        ));

        it('should show one question on the second page when there are three questions in total and two pages', inject([ActivatedRoute],
            (route: MockActivatedRoute) => {
                setActivatedRoute(route);
                fixture.detectChanges();

                let questions = fixture.debugElement.queryAll(By.directive(QuestionComponent));
                let question1Instance: QuestionComponent = questions[0].componentInstance;
                let question2Instance: QuestionComponent = questions[1].componentInstance;

                spyOn(question1Instance, 'updateQuestionAnswer').and.returnValue(Observable.of(null));
                spyOn(question2Instance, 'updateQuestionAnswer').and.returnValue(Observable.of(null));

                let pager = fixture.debugElement.query(By.directive(QuestionPagerComponent));
                let pagerPage = new QuestionPagerComponentPage(pager);
                pagerPage.next();
                fixture.detectChanges();

                questions = fixture.debugElement.queryAll(By.directive(QuestionComponent));
                expect(questions.length).toBe(1);

                let numericQuestion = questions[0].query(By.directive(NumericQuestionForm));
                expect(numericQuestion instanceof DebugElement).toBe(true);

                let question3Instance = questions[0].componentInstance;
                expect(question3Instance.question).toEqual(question3);
                expect(question3Instance.answer).toBeUndefined();
            }
        ));
    });

    describe('Finish fill out button', () => {
        it('should persist answers from the current page', inject([ActivatedRoute],
            (route: MockActivatedRoute) => {
                setActivatedRoute(route);
                fixture.detectChanges();

                let questions = fixture.debugElement.queryAll(By.directive(QuestionComponent));
                let question1Instance: QuestionComponent = questions[0].componentInstance;
                let question2Instance: QuestionComponent = questions[1].componentInstance;

                let answer2a = {
                    id: 15,
                    progress: {id: 9},
                    question: {id: 1},
                    answers: 'Very very very long text',
                };

                spyOn(question1Instance, 'updateQuestionAnswer').and.returnValue(Observable.of(null));
                spyOn(question2Instance, 'updateQuestionAnswer').and.returnValue(Observable.of(answer2a));

                let finishButton = fixture.debugElement.query(By.css('.finish-survey'));
                finishButton.triggerEventHandler('click', event);

                expect(question1Instance.updateQuestionAnswer).toHaveBeenCalled();
                expect(question2Instance.updateQuestionAnswer).toHaveBeenCalled();
                expect(comp.allAnswers.get(1)).toEqual(answer2a);
            }
        ));

        it('should take the user to survey info page', inject([ActivatedRoute, Router],
            (route: MockActivatedRoute, router: MockRouter) => {
                setActivatedRoute(route);
                fixture.detectChanges();

                let questions = fixture.debugElement.queryAll(By.directive(QuestionComponent));
                let question1Instance: QuestionComponent = questions[0].componentInstance;
                let question2Instance: QuestionComponent = questions[1].componentInstance;

                spyOn(question1Instance, 'updateQuestionAnswer').and.returnValue(Observable.of(null));
                spyOn(question2Instance, 'updateQuestionAnswer').and.returnValue(Observable.of(null));

                let finishButton = fixture.debugElement.query(By.css('.finish-survey'));
                finishButton.triggerEventHandler('click', event);
                expect(router.navigate).toHaveBeenCalledWith(['../result'], { relativeTo: route });
            }
        ));
    });

});
