import {ChooseOneAnswerComponent} from "./choose-one-answer.component";
import {async, ComponentFixture, TestBed} from "@angular/core/testing";
import {Question, questionTypes} from "../../../data/question.data";
import {Answer} from "../../../data/answer.data";
import {By} from "@angular/platform-browser";
describe('ChooseOneAnswerComponent', () => {
    let fixture: ComponentFixture<ChooseOneAnswerComponent>;
    let component: ChooseOneAnswerComponent;

    let question: Question = {
        id: 3,
        type: questionTypes.choose_one,
        text: 'Choose numbers',
        required: false,
        answerLabels: ['3', '5', '7'],
        author: {id: 7},
        survey: {id: 4},
        otherAnswer: 'Your number'
    };

    let answer: Answer = {
        id: 14,
        progress: {id: 9},
        question: {id: 3},
        answers: 1
    };

    let userAnswer: Answer = {
        id: 14,
        progress: {id: 9},
        question: {id: 3},
        answers: 'other',
        userAnswer: '4'
    };

    beforeEach( async(() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [ChooseOneAnswerComponent],
            providers: []
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(ChooseOneAnswerComponent);
                component = fixture.componentInstance;
            });
    }));

    it('should display the label of the chosen answer', () => {
        component.question = question;
        component.answer = answer;
        fixture.detectChanges();
        let answerLabel = fixture.debugElement.query(By.css('.choose-one-answer'));
        expect(answerLabel.nativeElement.innerHTML).toContain('5');
    });

    it('should display user answer when other option is chosen', () => {
        component.question = question;
        component.answer = userAnswer;
        fixture.detectChanges();
        let answerLabel = fixture.debugElement.query(By.css('.choose-one-answer'));
        expect(answerLabel.nativeElement.innerHTML).toContain('4');
    });
});

