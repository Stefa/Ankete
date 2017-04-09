import {AnswerComponent} from "./answer.component";
import {async, ComponentFixture, TestBed} from "@angular/core/testing";
import {Question, questionTypes} from "../../data/question.data";
import {Answer} from "../../data/answer.data";
import {NumericAnswerComponent} from "../survey-result-answers/numeric-answer/numeric-answer.component";
import {TextAnswerComponent} from "../survey-result-answers/text-answer/text-answer.component";
import {LongTextAnswerComponent} from "../survey-result-answers/long-text-answer/long-text-answer.component";
import {ChooseOneAnswerComponent} from "../survey-result-answers/choose-one-answer/choose-one-answer.component";
import {ChooseMultipleAnswerComponent} from "../survey-result-answers/choose-multiple-answer/choose-multiple-answer.component";
import {By} from "@angular/platform-browser";
import {DebugElement} from "@angular/core";

describe('AnswerComponent', () => {
    let fixture: ComponentFixture<AnswerComponent>;
    let comp: AnswerComponent;

    beforeEach( async(() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [
                AnswerComponent,
                NumericAnswerComponent,
                TextAnswerComponent,
                LongTextAnswerComponent,
                ChooseOneAnswerComponent,
                ChooseMultipleAnswerComponent
            ],
            providers: []
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(AnswerComponent);
                comp    = fixture.componentInstance;
            });
    }));

    let numericQuestion: Question = {
        id: 3,
        type: questionTypes.numeric,
        text: 'Write numbers',
        required: false,
        answerLabels: ['number1', 'number2', 'number3'],
        author: {id: 7},
        survey: {id: 4}
    };

    let numericAnswer: Answer = {
        id: 14,
        progress: {id: 9},
        question: {id: 3},
        answers: [0,2, null]
    };

    let textQuestion: Question = {
        id: 3,
        type: questionTypes.text,
        text: 'Write names',
        required: false,
        answerLabels: ['name1', 'name2', 'name3'],
        author: {id: 7},
        survey: {id: 4}
    };

    let textAnswer: Answer = {
        id: 14,
        progress: {id: 9},
        question: {id: 3},
        answers: ['Dikembe', 'Mutombo', null]
    };

    let longTextQuestion: Question = {
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

    let longTextAnswer: Answer = {
        id: 14,
        progress: {id: 9},
        question: {id: 3},
        answers: longText
    };

    let chooseOneQuestion: Question = {
        id: 3,
        type: questionTypes.choose_one,
        text: 'Choose numbers',
        required: false,
        answerLabels: ['3', '5', '7'],
        author: {id: 7},
        survey: {id: 4},
        otherAnswer: 'Your number'
    };

    let chooseOneAnswer: Answer = {
        id: 14,
        progress: {id: 9},
        question: {id: 3},
        answers: 1
    };

    let chooseMultipleQuestion: Question = {
        id: 3,
        type: questionTypes.choose_multiple,
        text: 'Choose numbers',
        required: false,
        answerLabels: ['3', '5', '7'],
        author: {id: 7},
        survey: {id: 4},
        otherAnswer: 'Your number'
    };

    let chooseMultipleAnswer: Answer = {
        id: 14,
        progress: {id: 9},
        question: {id: 3},
        answers: [0,2]
    };

    let questionsAndAnswers = [
        {type: 'numeric', question: numericQuestion, answer: numericAnswer, answerClass: NumericAnswerComponent},
        {type: 'text', question: textQuestion, answer: textAnswer, answerClass: TextAnswerComponent},
        {type: 'long text', question: longTextQuestion, answer: longTextAnswer, answerClass: LongTextAnswerComponent},
        {type: 'choose one', question: chooseOneQuestion, answer: chooseOneAnswer, answerClass: ChooseOneAnswerComponent},
        {type: 'choose multiple', question: chooseMultipleQuestion, answer: chooseMultipleAnswer, answerClass: ChooseMultipleAnswerComponent},
    ];

    questionsAndAnswers.forEach( qAndA => {
        it(`should display ${qAndA.type} answer component provided the question of ${qAndA.type} type`, () => {
            comp.question = qAndA.question;
            comp.answer = qAndA.answer;
            fixture.detectChanges();

            let answerComponent = fixture.debugElement.query(By.directive(qAndA.answerClass));
            expect(answerComponent instanceof DebugElement).toBe(true);
        });

        it(`should pass appropriate question and answer object to ${qAndA.type} answer component`, () => {
            comp.question = qAndA.question;
            comp.answer = qAndA.answer;
            fixture.detectChanges();

            let answerComponent = fixture.debugElement.query(By.directive(qAndA.answerClass));
            let answerComponentInstance = answerComponent.componentInstance;
            expect(answerComponentInstance.question).toEqual(qAndA.question);
            expect(answerComponentInstance.answer).toEqual(qAndA.answer);
        })
    })
});