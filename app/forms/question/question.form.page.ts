import {DebugElement} from "@angular/core";
import {Page} from "../../test/page";

export class QuestionFormPage extends Page{

    typeInput;
    textInput;
    answerInput;
    addAnswerButton;
    cancelButton;

    typeErrorElement;
    textErrorElement;

    form;

    constructor(questionFormDebugElement: DebugElement) {
        super(questionFormDebugElement);
        this.typeInput = this.getElementByCss('.question-type');
        this.textInput = this.getElementByCss('.question-text');
        this.cancelButton = this.getDebugElementByCss('.question-cancel');
        this.form = this.getElementByCss('form');
    }

    getAnswerInput() {
        this.answerInput = this.getElementByCss('.question-answer');
        this.addAnswerButton = this.getDebugElementByCss('.add-question-answer');
    }

    setText(text: string) {
        this.setInput(this.textInput, text);
    }

    setType(value: any) {
        this.setSelect(this.typeInput, value);
    }

    setAnswer(answerText: string) {
        this.setInput(this.answerInput, answerText);
        this.click(this.addAnswerButton);
    }

    submitForm() {
        this.form.dispatchEvent(new Event('submit'));
    }

    cancelForm() {
        this.click(this.cancelButton);
    }

    getErrors() {
        this.typeErrorElement = this.getElementFromHtml('.ui.error.message.question-type');
        this.textErrorElement = this.getElementFromHtml('.ui.error.message.question-text');
    }
}
