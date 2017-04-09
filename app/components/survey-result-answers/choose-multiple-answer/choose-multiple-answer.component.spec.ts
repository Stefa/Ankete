import {ChooseMultipleAnswerComponent} from "./choose-multiple-answer.component";
import {async, ComponentFixture, TestBed} from "@angular/core/testing";
import {Question, questionTypes} from "../../../data/question.data";
import {Answer} from "../../../data/answer.data";
import {By} from "@angular/platform-browser";
describe('ChooseMultipleAnswerComponent', () => {
    let fixture: ComponentFixture<ChooseMultipleAnswerComponent>;
    let component: ChooseMultipleAnswerComponent;

    let question: Question = {
        id: 3,
        type: questionTypes.choose_multiple,
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
        answers: [0,2]
    };

    let userAnswer: Answer = {
        id: 14,
        progress: {id: 9},
        question: {id: 3},
        answers: [0,2],
        userAnswer: '4'
    };

    beforeEach( async(() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [ChooseMultipleAnswerComponent],
            providers: []
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(ChooseMultipleAnswerComponent);
                component = fixture.componentInstance;
            });
    }));

    it('should display the labels of the chosen answers', () => {
        component.question = question;
        component.answer = answer;
        fixture.detectChanges();
        let answerLabels = fixture.debugElement.queryAll(By.css('.choose-multiple-answer'));
        expect(answerLabels.length).toBe(2);
        expect(answerLabels[0].nativeElement.innerHTML).toContain('3');
        expect(answerLabels[1].nativeElement.innerHTML).toContain('7');
    });

    it('should display user answer when other option is chosen', () => {
        component.question = question;
        component.answer = userAnswer;
        fixture.detectChanges();
        let answerLabels = fixture.debugElement.queryAll(By.css('.choose-multiple-answer'));
        expect(answerLabels.length).toBe(3);
        expect(answerLabels[2].nativeElement.innerHTML).toContain('4');
    });
});
