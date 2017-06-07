import {Page} from "../../test/page";
import {DebugElement} from "@angular/core";

export class ChangePasswordFormPage extends Page {
    oldPasswordInput;
    newPasswordInput;
    newPasswordConfirmInput;

    oldPasswordEmptyErrorElement;
    newPasswordEmptyErrorElement;
    passwordConfirmEmptyErrorElement;
    wrongPasswordErrorElement;

    form;

    constructor(changePasswordFormDebugElement: DebugElement) {
        super(changePasswordFormDebugElement);

        this.oldPasswordInput = this.getElementByCss('.old-password');
        this.newPasswordInput = this.getElementByCss('.new-password');
        this.newPasswordConfirmInput = this.getElementByCss('.new-password-confirm');

        this.form = this.getElementByCss('form');
    }

    setOldPassword(oldPassword: string) {
        this.setInput(this.oldPasswordInput, oldPassword);
    }

    setNewPassword(newPassword: string) {
        this.setInput(this.newPasswordInput, newPassword);
    }

    setNewPasswordConfirm(newPasswordConfirm: string) {
        this.setInput(this.newPasswordConfirmInput, newPasswordConfirm);
    }

    submitForm() {
        this.form.dispatchEvent(new Event('submit'));
    }

    getErrors() {
        this.oldPasswordEmptyErrorElement = this.getElementFromHtml('.ui.error.message.old-password-empty');
        this.newPasswordEmptyErrorElement = this.getElementFromHtml('.ui.error.message.new-password-empty');
        this.passwordConfirmEmptyErrorElement = this.getElementFromHtml('.ui.error.message.confirm-password-empty');
        this.wrongPasswordErrorElement = this.getElementFromHtml('.ui.error.message.old-password-wrong');
    }
}
