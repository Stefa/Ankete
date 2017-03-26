import {User, userTypes} from "../../data/user.data";
import {questionTypes} from "../../data/question.data";
import {Survey} from "../../data/survey.data";
import {Progress, UserData} from "../../data/progress.data";
import {ComponentFixture, async, TestBed, inject} from "@angular/core/testing";
import {MockRouterLinkDirective} from "../../test/mock.router-link";
import {SurveyInfoComponent} from "./survey-info.component";
import {Router, ActivatedRoute} from "@angular/router";
import {MockRouter} from "../../test/mock.router";
import {MockActivatedRoute} from "../../test/mock.activated-route";
import {ReactiveFormsModule, FormsModule} from "@angular/forms";
import {MyDatePickerModule} from "mydatepicker";
import * as moment from 'moment/moment';
import {SurveyInfoComponentPage} from "./survey-info.component.page";
import {ProgressService} from "../../services/progress/progress.service";
import {ApiService} from "../../services/api/api.service";
import {Http, HttpModule} from "@angular/http";
import {AnswerService} from "../../services/answer/answer.service";
import {Observable} from "rxjs/Rx";
import {AuthService} from "../../services/authentication/auth.service";
import {UserService} from "../../services/user/user.service";
import any = jasmine.any;

describe('SurveyInfoComponent', () => {
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
        questions: [
            {
                id: 1,
                type: questionTypes.long_text,
                text: 'Enter long text',
                required: false,
                author: {id: 7},
                survey: {id: 4}
            },
            {
                id: 2,
                type: questionTypes.choose_multiple,
                text: 'Choose multiple',
                required: false,
                answerLabels: ['choice1', 'choice2', 'choice3'],
                otherAnswer: 'other',
                author: {id: 7},
                survey: {id: 4}
            },
            {
                id: 3,
                type: questionTypes.numeric,
                text: 'Write numbers',
                required: false,
                answerLabels: ['number1', 'number2', 'number3'],
                author: {id: 7},
                survey: {id: 4}
            }
        ],
        blocked: false,
    };

    let fullProgress: Progress = {
        id: 9,
        survey: {id: 4},
        user: {id: 12},
        finished: false,
        progress: {done: 1, total: 3},
        answers: [
            {
                id: 14,
                progress: {id: 9},
                question: {id: 2},
                answers: [0,2],
                userAnswer: 'my choice'
            },
            {
                id: 15,
                progress: {id: 9},
                question: {id: 1},
                answers: 'Very long text',
            }
        ]
    };

    let fixture: ComponentFixture<SurveyInfoComponent>;
    let comp: SurveyInfoComponent;

    function setActivatedRoute(route: MockActivatedRoute, survey, progress, proxy?) {
        let routeParams = {surveyId: survey.id};
        let routeData:any = {
            survey: survey,
            progress: progress,
        };
        if(proxy) routeData.proxy = proxy;

        route.testParams = routeParams;
        route.testData = routeData;
    }

    beforeEach( async(() => {
        TestBed.configureTestingModule({
            imports: [FormsModule, ReactiveFormsModule, MyDatePickerModule, HttpModule],
            declarations: [
                SurveyInfoComponent,
                MockRouterLinkDirective
            ],
            providers: [
                ProgressService, ApiService, AnswerService, AuthService, UserService,
                {provide: Router, useClass: MockRouter},
                {provide: ActivatedRoute, useClass: MockActivatedRoute}
            ]
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(SurveyInfoComponent);
                comp    = fixture.componentInstance;
            });
    }));

    describe('Start button', () => {
        it('should be active if present day is between start and end and survey is not locked',
            inject([ActivatedRoute], (route: MockActivatedRoute) => {
                let survey = $.extend(true, {}, fullSurvey);
                let progress = $.extend(true, {}, fullProgress);
                setActivatedRoute(route, survey, progress);

                fixture.detectChanges();
                expect(comp.startButtonActive).toBe(true);
            })
        );

        it('should not be active if survey has not started yet', inject([ActivatedRoute],
            (route: MockActivatedRoute) => {
                let survey = $.extend(true, {}, fullSurvey);
                survey.start = moment().add(1, 'days').toDate();
                let progress = $.extend(true, {}, fullProgress);
                setActivatedRoute(route, survey, progress);

                fixture.detectChanges();
                expect(comp.startButtonActive).toBe(false);
            }
        ));

        it('should not be active if survey has ended', inject([ActivatedRoute],
            (route: MockActivatedRoute) => {
                let survey = $.extend(true, {}, fullSurvey);
                survey.end = moment().subtract(1, 'days').toDate();
                let progress = $.extend(true, {}, fullProgress);
                setActivatedRoute(route, survey, progress);

                fixture.detectChanges();
                expect(comp.startButtonActive).toBe(false);
            }
        ));

        it('should not be active if survey is locked', inject([ActivatedRoute],
            (route: MockActivatedRoute) => {
                let survey = $.extend(true, {}, fullSurvey);
                let progress = $.extend(true, {}, fullProgress);
                progress.finished = true;
                setActivatedRoute(route, survey, progress);

                fixture.detectChanges();
                expect(comp.startButtonActive).toBe(false);
            }
        ));

        it('should have "Popuni" label if survey fill out has not been started yet', inject([ActivatedRoute],
            (route: MockActivatedRoute) => {
                let survey = $.extend(true, {}, fullSurvey);
                let progress = $.extend(true, {}, fullProgress);
                progress.progress.done = 0;
                setActivatedRoute(route, survey, progress);

                fixture.detectChanges();
                expect(comp.startButtonLabel).toBe('Popuni');
            }
        ));

        it('should have "Nastavi" label if survey fill out has already been started', inject([ActivatedRoute],
            (route: MockActivatedRoute) => {
                let survey = $.extend(true, {}, fullSurvey);
                let progress = $.extend(true, {}, fullProgress);
                setActivatedRoute(route, survey, progress);

                fixture.detectChanges();
                expect(comp.startButtonLabel).toBe('Nastavi');
            }
        ));

        it('should navigate to survey fill out page when clicked', inject([ActivatedRoute, Router],
            (route: MockActivatedRoute, router: MockRouter) => {
                let survey = $.extend(true, {}, fullSurvey);
                let progress = $.extend(true, {}, fullProgress);
                setActivatedRoute(route, survey, progress);

                fixture.detectChanges();
                let page = new SurveyInfoComponentPage(fixture.debugElement);
                page.startSurvey();
                expect(router.navigate).toHaveBeenCalledWith(['../fill-out'], { relativeTo: route });
            }
        ));
    });

    describe('Answers button', () => {
        it('should be active if there is at least one answer for the survey',
            inject([ActivatedRoute], (route: MockActivatedRoute) => {
                let survey = $.extend(true, {}, fullSurvey);
                let progress = $.extend(true, {}, fullProgress);
                setActivatedRoute(route, survey, progress);

                fixture.detectChanges();
                expect(comp.answersButtonActive).toBe(true);
            })
        );

        it('should not be active if there are no answers yet',
            inject([ActivatedRoute], (route: MockActivatedRoute) => {
                let survey = $.extend(true, {}, fullSurvey);
                let progress = null;
                setActivatedRoute(route, survey, progress);

                fixture.detectChanges();
                expect(comp.answersButtonActive).toBe(false);
            })
        );

        it('should navigate to survey result page when clicked', inject([ActivatedRoute, Router],
            (route: MockActivatedRoute, router: MockRouter) => {
                let survey = $.extend(true, {}, fullSurvey);
                let progress = $.extend(true, {}, fullProgress);
                setActivatedRoute(route, survey, progress);

                fixture.detectChanges();
                let page = new SurveyInfoComponentPage(fixture.debugElement);
                page.viewAnswers();
                expect(router.navigate).toHaveBeenCalledWith(['../result'], { relativeTo: route });
            }
        ));
    });

    describe('Finish button', () => {
        it('should be active if all required questions have answers', inject([ActivatedRoute],
            (route: MockActivatedRoute) => {
                let survey = $.extend(true, {}, fullSurvey);
                let progress = $.extend(true, {}, fullProgress);
                setActivatedRoute(route, survey, progress);

                fixture.detectChanges();
                expect(comp.lockButtonActive).toBe(true);
            })
        );

        it('should not be active if any of the required questions do not have answers', inject([ActivatedRoute],
            (route: MockActivatedRoute) => {
                let survey = $.extend(true, {}, fullSurvey);
                survey.questions[2].required = true;
                let progress = $.extend(true, {}, fullProgress);
                setActivatedRoute(route, survey, progress);

                fixture.detectChanges();
                expect(comp.lockButtonActive).toBe(false);
            })
        );

        it('should lock the survey when clicked', inject([ActivatedRoute, ProgressService],
            (route: MockActivatedRoute, progressService: ProgressService) => {
                let survey = $.extend(true, {}, fullSurvey);
                let progress = $.extend(true, {}, fullProgress);
                let updatedProgress = $.extend(true, {}, fullProgress, {finished: true});
                setActivatedRoute(route, survey, progress);
                fixture.detectChanges();

                spyOn(progressService, 'setFinished').and.returnValue(Observable.of(updatedProgress));

                let page = new SurveyInfoComponentPage(fixture.debugElement);
                page.finishSurvey();
                fixture.detectChanges();

                expect(progressService.setFinished).toHaveBeenCalledWith(progress.id);
                expect(comp.lockButtonActive).toBe(false);
            })
        );
    });

    describe('Proxy fill out', () => {
        let survey: Survey;
        let progress: Progress;
        let proxy: boolean;

        let birthdayString: string;
        let clerk: User;
        let userData: any;
        let newProgress: Progress;
        let newProgressRequest: any;

        function prepareData() {
            survey = $.extend(true, {}, fullSurvey);
            survey.anonymous = false;
            progress = null;
            proxy = true;

            clerk = {
                id: 12,
                type: userTypes.clerk,
                name: 'Leonardo',
                surname: 'da Vinci',
                username: 'Leo',
                password: 'turtlePower',
                birthday: new Date(1452, 4, 15),
                phone: '161803398',
                email: 'gmail@leo.com',
            };

            userData = {
                name: 'Zaphod',
                surname: 'Beeblebrox',
                birthday: new Date(1952, 2, 11)
            };

            birthdayString = '11.03.1952';

            newProgress = $.extend(true, {}, fullProgress);
            newProgress.answers = [];
            newProgress.progress.done = 0;
            newProgress.userData = userData;

            newProgressRequest = $.extend(true, {}, newProgress);
            delete newProgressRequest.id;
            newProgressRequest.user = clerk;
            newProgressRequest.survey = $.extend(true, {}, fullSurvey);
            newProgressRequest.survey.anonymous = false;
        }

        beforeEach(() => {
            prepareData();
        });

        it('should show user data form when proxy is true', inject([ActivatedRoute],
            (route: MockActivatedRoute) => {
                setActivatedRoute(route, survey, progress, proxy);

                fixture.detectChanges();
                expect(comp.showUserDataForm).toBe(true);
            }
        ));

        it('should create a new progress object when starting survey fill out', inject(
            [ActivatedRoute, ProgressService, AuthService],
            (route: MockActivatedRoute, progressService: ProgressService, authService: AuthService) => {
                setActivatedRoute(route, survey, progress, proxy);

                spyOn(authService, 'getLoggedInUser').and.returnValue(clerk);
                spyOn(progressService, 'createProgress').and.returnValue(Observable.of(newProgress));

                fixture.detectChanges();
                let page = new SurveyInfoComponentPage(fixture.debugElement);
                page.getUserDataInputs();
                page.setName(userData.name);
                page.setSurname(userData.surname);
                page.setBirthday(birthdayString);
                fixture.detectChanges();
                page.startSurvey();

                expect(authService.getLoggedInUser).toHaveBeenCalled();
                expect(progressService.createProgress).toHaveBeenCalledWith(newProgressRequest);
            }
        ));

        it('should navigate to survey proxy fill out page after the progress has been created', inject(
            [ActivatedRoute, ProgressService, AuthService, Router],
            (route: MockActivatedRoute, progressService: ProgressService, authService: AuthService, router: MockRouter) => {
                setActivatedRoute(route, survey, progress, proxy);

                spyOn(authService, 'getLoggedInUser').and.returnValue(clerk);
                spyOn(progressService, 'createProgress').and.returnValue(Observable.of(newProgress));

                fixture.detectChanges();
                let page = new SurveyInfoComponentPage(fixture.debugElement);
                page.getUserDataInputs();
                page.setName(userData.name);
                page.setSurname(userData.surname);
                page.setBirthday(birthdayString);
                fixture.detectChanges();
                page.startSurvey();

                expect(router.navigate).toHaveBeenCalledWith(['../fill-out', newProgress.id], { relativeTo: route });
            }
        ));
    });
});

