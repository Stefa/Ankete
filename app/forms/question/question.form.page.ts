import {DebugElement} from "@angular/core";
import {Page} from "../../test/page";

export class QuestionFormPage extends Page{

    typeInput;
    textInput;
    requiredCheckbox;
    answerInput;
    addAnswerButton;
    otherAnswerCheckbox;
    otherAnswerInput;
    cancelButton;

    typeErrorElement;
    textErrorElement;
    questionServiceErrorElement;

    form;

    constructor(questionFormDebugElement: DebugElement) {
        super(questionFormDebugElement);
        this.typeInput = this.getElementByCss('.question-type');
        this.textInput = this.getElementByCss('.question-text');
        this.requiredCheckbox = this.getElementByCss('.question-required');
        this.cancelButton = this.getDebugElementByCss('.question-cancel');
        this.form = this.getElementByCss('form');
    }

    getAnswerInput() {
        this.answerInput = this.getElementByCss('.question-answer');
        this.addAnswerButton = this.getDebugElementByCss('.add-question-answer');
    }

    getOtherAnswerCheckbox() {
        this.otherAnswerCheckbox = this.getElementByCss('.question-other-answer');
    }
    getOtherAnswerInput() {
        this.otherAnswerInput = this.getElementByCss('.question-other-answer-text');
    }

    setText(text: string) {
        this.setInput(this.textInput, text);
    }

    setType(value: any) {
        this.setSelect(this.typeInput, value);
    }

    setRequired() {
        this.requiredCheckbox.click();
    }

    setAnswer(answerText: string) {
        this.setInput(this.answerInput, answerText);
        this.click(this.addAnswerButton);
    }

    setOtherAnswer() {
        this.otherAnswerCheckbox.click();
    }
    setOtherAnswerText(text: string) {
        this.setInput(this.otherAnswerInput, text);
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
        this.questionServiceErrorElement = this.getElementFromHtml('.ui.error.message.question-service-error');
    }
}
