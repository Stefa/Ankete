import {DebugElement} from "@angular/core";
import {By} from "@angular/platform-browser";

export class LoginFormPage {
    loginFormElement;

    usernameInput;
    passwordInput;
    form;

    formErrorElement;
    usernameErrorElement;
    passwordErrorElement;

    constructor(loginFormDebugElement: DebugElement) {
        this.loginFormElement = loginFormDebugElement.nativeElement;
        this.usernameInput = loginFormDebugElement.query(By.css('#username')).nativeElement;
        this.passwordInput = loginFormDebugElement.query(By.css('#password')).nativeElement;
        this.form = loginFormDebugElement.query(By.css('form')).nativeElement;
    }

    private setInput(inputElement, value) {
        inputElement.value = value;
        inputElement.dispatchEvent(new Event('input'));
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
        this.formErrorElement = this.loginFormElement.querySelector('.ui.error.message.login-form');
        this.usernameErrorElement = this.loginFormElement.querySelector('.ui.error.message.username');
        this.passwordErrorElement = this.loginFormElement.querySelector('.ui.error.message.password');
    }
}