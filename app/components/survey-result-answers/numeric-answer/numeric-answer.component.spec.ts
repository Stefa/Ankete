import {NumericAnswerComponent} from "./numeric-answer.component";
import {async, ComponentFixture, TestBed} from "@angular/core/testing";
import {Question, questionTypes} from "../../../data/question.data";
import {Answer} from "../../../data/answer.data";
import {By} from "@angular/platform-browser";
describe('NumericAnswerComponent', () => {
    let fixture: ComponentFixture<NumericAnswerComponent>;
    let component: NumericAnswerComponent;

    let question: Question = {
        id: 3,
        type: questionTypes.numeric,
        text: 'Write numbers',
        required: false,
        answerLabels: ['number1', 'number2', 'number3'],
        author: {id: 7},
        survey: {id: 4}
    };

    let answer: Answer = {
        id: 14,
        progress: {id: 9},
        question: {id: 3},
        answers: [0,2, null]
    };

    beforeEach( async(() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [NumericAnswerComponent],
            providers: []
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(NumericAnswerComponent);
                component = fixture.componentInstance;
                component.question = question;
                component.answer = answer;
                fixture.detectChanges();
            });
    }));

    it('should show three answers if question has three answer labels', () => {
        let answers = fixture.debugElement.queryAll(By.css('.numeric-answer'));
        expect(answers.length).toBe(3);
    });

    it('should show label following the answer if answer is not null', () => {
        let answers = fixture.debugElement.queryAll(By.css('.numeric-answer'));
        let answered = answers[0];
        let labelElement = answered.query(By.css('.label'));
        let answerElement = answered.query(By.css('.answer'));

        expect(labelElement.nativeElement.innerHTML).toContain(question.answerLabels[0]);
        expect(answerElement.nativeElement.innerHTML).toContain(String(answer.answers[0]));
    });

    it('should show label following empty answer if answer is null', () => {
        let answers = fixture.debugElement.queryAll(By.css('.numeric-answer'));
        let unanswered = answers[2];
        let labelElement = unanswered.query(By.css('.label'));
        let answerElement = unanswered.query(By.css('.answer'));

        expect(labelElement.nativeElement.innerHTML).toContain(question.answerLabels[2]);
        expect(answerElement.nativeElement.innerHTML).toBe("");
    });
});
