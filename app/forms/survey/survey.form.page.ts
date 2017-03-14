import {Page} from "../../test/page";
import {DebugElement} from "@angular/core";
import {QuestionFormPage} from "../question/question.form.page";
import {By} from "@angular/platform-browser";
import {QuestionForm} from "../question/question.form";

export class SurveyFormPage extends Page {
    nameInput;
    startInput;
    endInput;
    anonymousInput;
    pagesInput;

    addQuestionButton;
    questionFormPage: QuestionFormPage;

    cancelButton;

    nameMissingErrorElement;
    startMissingErrorElement;
    endMissingErrorElement;
    startInvalidErrorElement;
    endInvalidErrorElement;
    startAfterEndErrorElement;
    tooMuchPagesError;

    form;

    constructor(surveyFormDebugElement: DebugElement) {
        super(surveyFormDebugElement);

        this.nameInput = this.getElementByCss('.survey-name');
        this.startInput = this.getElementByCss('.survey-start input');
        this.endInput = this.getElementByCss('.survey-end input');
        this.anonymousInput = this.getElementByCss('.survey-anonymous');
        this.pagesInput = this.getElementByCss('.survey-pages');

        this.addQuestionButton = this.getDebugElementByCss('.survey-add-question');

        this.cancelButton = this.getDebugElementByCss('.survey-cancel');
        this.form = this.getElementByCss('form');
    }

    setName(name: string) {
        this.setInput(this.nameInput, name);
    }

    setStart(start: string) {
        this.setDate(this.startInput, start);
    }

    setEnd(end: string) {
        this.setDate(this.endInput, end);
    }

    setAnonymous() {
        this.anonymousInput.click();
    }

    setPages(pages: string) {
        this.setInput(this.pagesInput, pages);
    }

    private setDate(dateInput, date) {
        dateInput.value = date;
        dateInput.dispatchEvent(new Event('keyup'));
    }

    showQuestionForm() {
        this.click(this.addQuestionButton);
    }

    getQuestionFormPage() {
        let questionFormDebugElement = this.topDebugElement.query(By.directive(QuestionForm));
        this.questionFormPage = new QuestionFormPage(questionFormDebugElement);
    }

    submitForm() {
        this.form.dispatchEvent(new Event('submit'));
    }

    cancelForm() {
        this.click(this.cancelButton);
    }

    getErrors() {
        this.nameMissingErrorElement = this.getElementFromHtml('.ui.error.message.survey-name-required');
        this.startMissingErrorElement = this.getElementFromHtml('.ui.error.message.survey-start-required');
        this.endMissingErrorElement = this.getElementFromHtml('.ui.error.message.survey-end-required');
        this.startInvalidErrorElement = this.getElementFromHtml('.ui.error.message.survey-start-invalid');
        this.endInvalidErrorElement = this.getElementFromHtml('.ui.error.message.survey-end-invalid');
        this.startAfterEndErrorElement = this.getElementFromHtml('.ui.error.message.survey-start-after-end');
        this.tooMuchPagesError = this.getElementFromHtml('.ui.error.message.user-pages');
    }
}