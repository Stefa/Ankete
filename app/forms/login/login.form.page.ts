import {DebugElement} from "@angular/core";
import {Page} from "../../test/page";

export class LoginFormPage  extends Page{
    usernameInput;
    passwordInput;
    form;

    formErrorElement;
    usernameErrorElement;
    passwordErrorElement;

    constructor(loginFormDebugElement: DebugElement) {
        super(loginFormDebugElement);
        this.usernameInput = this.getElementByCss('#username');
        this.passwordInput = this.getElementByCss('#password');
        this.form = this.getElementByCss('form');
    }

    setUsername(username: string) {
        this.setInput(this.usernameInput, username);
    }
    setPassword(password: string) {
        this.setInput(this.passwordInput, password);
    }
    submitForm() {
        this.form.dispatchEvent(new Event('submit'));
    }
    login(username: string, password: string) {
        this.setUsername(username);
        this.setPassword(password);
        this.submitForm();
    }
    getErrors() {
        this.formErrorElement = this.getElementFromHtml('.ui.error.message.login-form');
        this.usernameErrorElement = this.getElementFromHtml('.ui.error.message.username');
        this.passwordErrorElement = this.getElementFromHtml('.ui.error.message.password');
    }
}