import {DebugElement} from "@angular/core";
import {Page} from "../../test/page";
export class UserFormPage extends Page{

    typeInput;
    nameInput;
    surnameInput;
    usernameInput;
    passwordInput;
    passwordConfirmInput;
    dayInput;
    monthInput;
    yearInput;
    phoneInput;
    emailInput;

    cancelButton;

    typeMissingErrorElement;
    nameMissingErrorElement;
    surnameMissingErrorElement;
    usernameMissingErrorElement;
    passwordMissingErrorElement;
    passwordLengthErrorElement;
    passwordConfirmMissingErrorElement;
    passwordMismatchErrorElement;
    birthdayMissingErrorElement;
    birthdayInvalidErrorElement;
    phoneMissingErrorElement;
    phoneInvalidErrorElement;
    emailMissingErrorElement;
    emailInvalidErrorElement;

    form;

    constructor(userFormDebugElement: DebugElement) {
        super(userFormDebugElement);

        this.typeInput = this.getElementByCss('.user-type');
        this.nameInput = this.getElementByCss('.user-name');
        this.surnameInput = this.getElementByCss('.user-surname');
        this.usernameInput = this.getElementByCss('.user-username');
        this.passwordInput = this.getElementByCss('.user-password');
        this.passwordConfirmInput = this.getElementByCss('.user-password-confirm');
        this.dayInput = this.getElementByCss('.user-birthday-day');
        this.monthInput = this.getElementByCss('.user-birthday-month');
        this.yearInput = this.getElementByCss('.user-birthday-year');
        this.phoneInput = this.getElementByCss('.user-phone');
        this.emailInput = this.getElementByCss('.user-email');

        this.cancelButton = this.getDebugElementByCss('.user-cancel');
        this.form = this.getElementByCss('form');
    }

    setType(value: any) {
        this.setSelect(this.typeInput, value);
    }
    setName(name: string) {
        this.setInput(this.nameInput, name);
    }
    setSurname(surname: string) {
        this.setInput(this.surnameInput, surname);
    }
    setUsername(username: string) {
        this.setInput(this.usernameInput, username);
    }
    setPassword(password: string) {
        this.setInput(this.passwordInput, password);
    }
    setPasswordConfirm(passwordConfirm: string) {
        this.setInput(this.passwordConfirmInput, passwordConfirm);
    }
    setDay(day: string) {
        this.setInput(this.dayInput, day);
    }
    setMonth(value: any) {
        this.setSelect(this.monthInput, value);
    }
    setYear(year: string) {
        this.setInput(this.yearInput, year);
    }
    setPhone(phone: string) {
        this.setInput(this.phoneInput, phone);
    }
    setEmail(email: string) {
        this.setInput(this.emailInput, email);
    }

    submitForm() {
        this.form.dispatchEvent(new Event('submit'));
    }

    cancelForm() {
        this.click(this.cancelButton);
    }

    getErrors() {
        this.nameMissingErrorElement = this.getElementFromHtml('.ui.error.message.user-name');
        this.typeMissingErrorElement = this.getElementFromHtml('.ui.error.message.user-type');
        this.surnameMissingErrorElement = this.getElementFromHtml('.ui.error.message.user-surname');
        this.usernameMissingErrorElement = this.getElementFromHtml('.ui.error.message.user-username');
        this.passwordMissingErrorElement = this.getElementFromHtml('.ui.error.message.user-password');
        this.passwordLengthErrorElement = this.getElementFromHtml('.ui.error.message.user-password-length');
        this.passwordConfirmMissingErrorElement = this.getElementFromHtml('.ui.error.message.user-password-confirm');
        this.passwordMismatchErrorElement = this.getElementFromHtml('.ui.error.message.user-password-mismatch');
        this.birthdayMissingErrorElement = this.getElementFromHtml('.ui.error.message.user-birthday');
        this.birthdayInvalidErrorElement = this.getElementFromHtml('.ui.error.message.user-birthday-invalid');
        this.phoneMissingErrorElement = this.getElementFromHtml('.ui.error.message.user-phone');
        this.phoneInvalidErrorElement = this.getElementFromHtml('.ui.error.message.user-phone-invalid');
        this.emailMissingErrorElement = this.getElementFromHtml('.ui.error.message.user-email');
        this.emailInvalidErrorElement = this.getElementFromHtml('.ui.error.message.user-email-invalid');
    }

}
