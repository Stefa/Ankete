import {Page} from "../../test/page";
import {DebugElement} from "@angular/core";

export class SurveyInfoComponentPage extends Page {
    startButton;
    answersButton;
    finishButton;

    nameInput;
    surnameInput;
    birthdayInput;

    nameMissingErrorElement;

    constructor(surveyInfoComponentDebugElement: DebugElement) {
        super(surveyInfoComponentDebugElement);

        this.startButton = this.getDebugElementByCss('.survey-info-start');
        this.answersButton = this.getDebugElementByCss('.survey-info-answers');
        this.finishButton = this.getDebugElementByCss('.survey-info-finish');
    }

    getUserDataInputs() {
        this.nameInput = this.getElementByCss('.survey-info-name');
        this.surnameInput = this.getElementByCss('.survey-info-surname');
        this.birthdayInput = this.getElementByCss('.survey-info-birthday input');
    }

    startSurvey() {
        this.click(this.startButton);
    }

    viewAnswers() {
        this.click(this.answersButton);
    }

    finishSurvey() {
        this.click(this.finishButton);
    }

    setName(name: string) {
        this.setInput(this.nameInput, name);
    }

    setSurname(surname: string) {
        this.setInput(this.surnameInput, surname);
    }

    setBirthday(birthday: string) {
        this.setDate(this.birthdayInput, birthday);
    }
}