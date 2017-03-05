import {Page} from "../../test/page";
import {DebugElement} from "@angular/core";

export class SurveyFormPage extends Page {
    nameInput;
    startInput;
    endInput;
    anonymousInput;
    pagesInput;

    cancelButton;

    nameMissingErrorElement;
    startMissingErrorElement;
    endMissingErrorElement;
    startInvalidErrorElement;
    endInvalidErrorElement;
    startAfterEndErrorElement;

    form;

    constructor(surveyFormDebugElement: DebugElement) {
        super(surveyFormDebugElement);

        this.nameInput = this.getElementByCss('.survey-name');
        this.startInput = this.getElementByCss('.survey-start input');
        this.endInput = this.getElementByCss('.survey-end input');
        this.anonymousInput = this.getElementByCss('.survey-anonymous');
        this.pagesInput = this.getElementByCss('.survey-pages');

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
    }
}