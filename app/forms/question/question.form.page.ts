import {DebugElement} from "@angular/core";
import {By} from "@angular/platform-browser";

export class QuestionFormPage {
    questionFormElement;
    questionFormDebugElement;

    typeInput;
    textInput;
    answerInputs;
    addAnswerButton;
    cancelButton;

    typeErrorElement;
    textErrorElement;

    form;

    constructor(questionFormDebugElement: DebugElement) {
        this.questionFormDebugElement = questionFormDebugElement;
        this.questionFormElement = questionFormDebugElement.nativeElement;
        this.typeInput = questionFormDebugElement.query(By.css('#question-type')).nativeElement;
        this.textInput = questionFormDebugElement.query(By.css('#question-text')).nativeElement;
        this.cancelButton = questionFormDebugElement.query(By.css('#question-cancel'));
        this.form = questionFormDebugElement.query(By.css('form')).nativeElement;
    }

    getAnswerInputs() {
        this.answerInputs = this.questionFormDebugElement.queryAll(By.css('.question-answer'));
        this.addAnswerButton = this.questionFormDebugElement.query(By.css('.add-question-answer'));
    }

    private setInput(inputElement, value) {
        inputElement.value = value;
        inputElement.dispatchEvent(new Event('input'));
    }

    private setSelect(selectElement, value) {
        selectElement.value = value;
        selectElement.dispatchEvent(new Event('change'));
    }

    setText(text: string) {
        this.setInput(this.textInput, text);
    }

    setType(value: any) {
        this.setSelect(this.typeInput, value);
    }

    addAnswers(numberOfAnswers: number = 1) {
        while(numberOfAnswers-- > 0)
            this.addAnswerButton.nativeElement.dispatchEvent(new Event('click'));
    }

    setAnswers(values: string[]) {
        this.answerInputs.forEach((answerElement:DebugElement, index: number) => {
            let answerText = index < values.length ? values[index] : '';
            this.setInput(answerElement.nativeElement, answerText);
        });
    }

    submitForm() {
        this.form.dispatchEvent(new Event('submit'));
    }

    cancelForm() {
        this.cancelButton.triggerEventHandler('click', null);
    }

    getErrors() {
        this.typeErrorElement = this.questionFormElement.querySelector('.ui.error.message.question-type');
        this.textErrorElement = this.questionFormElement.querySelector('.ui.error.message.question-text');
    }
}
