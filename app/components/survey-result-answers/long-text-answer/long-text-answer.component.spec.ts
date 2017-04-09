import {LongTextAnswerComponent} from "./long-text-answer.component";
import {async, ComponentFixture, TestBed} from "@angular/core/testing";
import {Question, questionTypes} from "../../../data/question.data";
import {Answer} from "../../../data/answer.data";
import {By} from "@angular/platform-browser";
describe('TextAnswerComponent', () => {
    let fixture: ComponentFixture<LongTextAnswerComponent>;
    let component: LongTextAnswerComponent;

    let question: Question = {
        id: 3,
        type: questionTypes.long_text,
        text: 'Write something',
        required: false,
        author: {id: 7},
        survey: {id: 4}
    };

    let longText = `For instance, on the planet Earth, man had always assumed that he was more intelligent 
        than dolphins because he had achieved so much—the wheel, New York, wars and so on—whilst all 
        the dolphins had ever done was muck about in the water having a good time. But conversely, 
        the dolphins had always believed that they were far more intelligent 
        than man—for precisely the same reasons.`;

    let answer: Answer = {
        id: 14,
        progress: {id: 9},
        question: {id: 3},
        answers: longText
    };

    beforeEach( async(() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [LongTextAnswerComponent],
            providers: []
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(LongTextAnswerComponent);
                component = fixture.componentInstance;
                component.question = question;
                component.answer = answer;
                fixture.detectChanges();
            });
    }));

    it('should show answer if it is not null', () => {
        let answer = fixture.debugElement.query(By.css('.long-text-answer'));
        expect(answer.nativeElement.innerHTML).toContain(longText);
    });
});
