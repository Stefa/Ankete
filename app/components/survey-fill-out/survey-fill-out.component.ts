import {Component, OnInit, QueryList, ViewChildren} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Progress} from "../../data/progress.data";
import {Survey} from "../../data/survey.data";
import {Question} from "../../data/question.data";
import {Answer} from "../../data/answer.data";
import {QuestionComponent} from "../question/question.component";
import {Observable} from "rxjs/Rx";
import {ProgressService} from "../../services/progress/progress.service";

@Component({
    moduleId: module.id,
    selector: 'survey-fill-out',
    templateUrl: 'survey-fill-out.component.html',
    styleUrls: ['survey-fill-out.component.css']
})
export class SurveyFillOutComponent implements OnInit {
    survey: Survey;
    progress: Progress;
    proxy: boolean;

    questionPage: QuestionPage;
    allAnswers: Map<number, Answer>;

    questions: Array<Question>;
    answers: Array<Answer>;

    page: number = 1;
    numberOfPages: number;

    @ViewChildren(QuestionComponent) questionComponents: QueryList<QuestionComponent>;

    constructor(private route: ActivatedRoute, private router: Router, private progressService: ProgressService) { }

    ngOnInit() {
        this.survey = this.route.snapshot.data['survey'];
        this.progress = this.route.snapshot.data['progress'];
        this.proxy = this.route.snapshot.data['proxy'];

        this.numberOfPages = this.survey.pages;
        this.questionPage = new QuestionPage(this.survey.questions, this.numberOfPages);
        this.allAnswers = (this.progress && this.progress.answers)
            ? this.createAnswerMap(this.progress.answers) : new Map<number, Answer>();

        this.setPage(this.page);
    }

    setPage(page) {
        this.page = page;
        this.getQuestions();
        this.getAnswers();
    }

    private getQuestions() {
        this.questions = this.questionPage.getQuestionsForPage(this.page);
    }

    private getAnswers() {
        this.answers = this.questions.map(
            question => this.allAnswers.get(question.id)
        );
    }

    private createAnswerMap(answers: Array<Answer>): Map<number, Answer> {
        return new Map<number, Answer>(answers.map(
            answer => <[number, Answer]>[answer.question.id, answer]
        ));
    }

    finishFillOut() {
        let resultRoute = (this.route.snapshot.params != null && 'progressId' in this.route.snapshot.params) ?
            ['../../result', this.route.snapshot.params.progressId] : ['../result'];
        let goToSurveyInfo = _ => this.router.navigate(resultRoute, { relativeTo: this.route});

        if(this.proxy) this.progressService.setFinished(this.progress.id).subscribe();

        this.saveAnswers(goToSurveyInfo);
    }

    pageChanged(page) {
        let goToPage = _ => this.setPage(page);
        this.saveAnswers(goToPage);
    }

    saveAnswers(afterSaveCallback: Function) {
        let answerQuestions$ = [];
        this.questionComponents.forEach(questionComponent => {
            answerQuestions$.push(questionComponent.updateQuestionAnswer());
        });
        Observable.forkJoin(answerQuestions$).subscribe(answers => {
            answers
                .filter(answer => !!answer)
                .forEach((answer:Answer) => this.allAnswers.set(answer.question.id, answer));

            this.updateProgress(afterSaveCallback);
        });
    }

    updateProgress(afterUpdateCallback: Function) {
        if(this.progress.progress.done == this.allAnswers.size) {
            afterUpdateCallback();
            return;
        }
        let progressObject: any = {done: this.allAnswers.size, total: this.progress.progress.total};

        this.progressService.updateProgress(this.progress.id, progressObject).subscribe( progress => {
            this.progress = progress;
            afterUpdateCallback();
        });
    }

}

class QuestionPage {
    perPageMore: number;
    perPageLess: number;
    withMore: number;

    constructor(private questions: Array<Question>, numberOfPages: number){
        let numberOfQuestions = questions.length;
        this.perPageMore = Math.ceil(numberOfQuestions/numberOfPages);
        this.perPageLess = Math.floor(numberOfQuestions/numberOfPages);
        this.withMore = numberOfQuestions % numberOfPages;
    }

    getQuestionsForPage(page: number): Array<Question> {
        return this.questions.slice(this.getSliceStart(page), this.getSliceEnd(page));
    }

    private getSliceStart(page: number): number {
        return page>this.withMore ?
            (page-1)*this.perPageLess + this.withMore :
            (page-1)*this.perPageMore
    }

    private getSliceEnd(page: number): number {
        return page>this.withMore ?
            page*this.perPageLess + this.withMore :
            page*this.perPageMore
    }

}
