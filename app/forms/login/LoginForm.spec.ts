import {TestBed, fakeAsync, tick, inject, async} from "@angular/core/testing";
import {FormsModule, ReactiveFormsModule, FormGroup} from "@angular/forms";
import {LoginForm} from "./LoginForm";
import {By} from "@angular/platform-browser";
import {AuthService} from "../../services/authentication/AuthService";
import {Observable} from 'rxjs/Rx';
import {UserService} from "../../services/user/UserService";
import {ApiService} from "../../services/api/ApiService";
import {HttpModule} from "@angular/http";
import {DebugElement} from "@angular/core";
import {Router} from "@angular/router";


describe('LoginFrom', () => {
    class MockRouter {
        navigationDone: Promise<boolean> = new Promise(((resolve, reject) => {resolve(true);}));
        navigate = jasmine.createSpy('navigate').and.returnValue(this.navigationDone);
    }
    const mockRouter = new MockRouter();
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [FormsModule, ReactiveFormsModule, HttpModule],
            declarations: [LoginForm],
            providers: [
                AuthService, UserService, ApiService,
                {provide: Router, useValue: mockRouter}
            ]
        })
            .compileComponents();
    }));

    function setInput(inputElemtn, value) {
        inputElemtn.value = value;
        inputElemtn.dispatchEvent(new Event('input'));
    }

    function submitForm(form) {
        form.dispatchEvent(new Event('submit'));
    }

    describe('LoginForm: initial state', () => {
        let fixture;
        let component;
        beforeEach(() => {
            fixture = TestBed.createComponent(LoginForm);
            component = fixture.componentInstance;
        });

        it('should have a defined component', () => {
            expect(component).toBeDefined();
        });
        it('should create a FormGroup', () => {
            expect(component.loginFormGroup instanceof FormGroup).toBe(true);
        });
        it('should have a username field', () => {
            let usernameInput = fixture.debugElement.query(By.css('#username'));
            expect(usernameInput instanceof DebugElement).toBe(true);
        });
        it('should have a password field', () => {
            let passwordInput = fixture.debugElement.query(By.css('#password'));
            expect(passwordInput instanceof DebugElement).toBe(true);
        });
    });

    describe('LoginForm: behaviour', () => {
        let fixture, element, usernameInput, passwordInput, form;

        beforeEach(() => {
            fixture = TestBed.createComponent(LoginForm);
            element = fixture.nativeElement;
            usernameInput = fixture.debugElement.query(By.css('#username')).nativeElement;
            passwordInput = fixture.debugElement.query(By.css('#password')).nativeElement;
            form = fixture.debugElement.query(By.css('form')).nativeElement;
            fixture.detectChanges();
        });

        it('sends the request to AuthService::login() on submit if all the fields are filled',
            inject([AuthService], fakeAsync(
                (authService: AuthService) => {
                    spyOn(authService, 'login').and.returnValue(Observable.of(true));

                    setInput(usernameInput, 'Leo');
                    setInput(passwordInput, 'turtlePower');

                    tick();
                    fixture.detectChanges();

                    submitForm(form);
                    tick();

                    expect(authService.login).toHaveBeenCalledWith('Leo', 'turtlePower');
                }
            ))
        );

        it('displays error message when username is missing',
            inject([AuthService], fakeAsync(
                (authService: AuthService) => {
                    spyOn(authService, 'login').and.returnValue(Observable.of(true));
                    setInput(passwordInput, 'turtlePower');

                    tick();
                    fixture.detectChanges();

                    submitForm(form);
                    tick();

                    let message = element.querySelector('.ui.error.message.username');

                    expect(message.innerHTML).toContain('Unesite korisničko ime');
                    expect(authService.login).not.toHaveBeenCalled();
                }
            ))
        );

        it('displays error message when password is missing',
            inject([AuthService], fakeAsync(
                (authService: AuthService) => {
                    spyOn(authService, 'login').and.returnValue(Observable.of(true));
                    setInput(usernameInput, 'Leo');

                    tick();
                    fixture.detectChanges();

                    submitForm(form);
                    tick();

                    let message = element.querySelector('.ui.error.message.password');

                    expect(message.innerHTML).toContain('Unesite šifru');
                    expect(authService.login).not.toHaveBeenCalled();
                }
            ))
        );
        it('displays the error message on login failure',
            inject([AuthService], fakeAsync(
                (authService: AuthService) => {
                    spyOn(authService, 'login').and.returnValue(Observable.of(false));

                    setInput(usernameInput, 'Leo');
                    setInput(passwordInput, 'cowabunga');

                    tick();
                    fixture.detectChanges();

                    submitForm(form);
                    tick();
                    fixture.detectChanges();

                    let message = element.querySelector('.ui.error.message.login-form');

                    expect(message.innerHTML).toContain('Pogrešno korisničko ime ili šifra!');
                }
            ))
        );
        it('redirects the user to the home page on successful login',
            inject([AuthService, Router], fakeAsync(
                (authService: AuthService, router: MockRouter) => {
                    spyOn(authService, 'login').and.returnValue(Observable.of(true));
                    setInput(usernameInput, 'Leo');
                    setInput(passwordInput, 'turtlePower');

                    tick();
                    fixture.detectChanges();

                    submitForm(form);
                    tick();
                    fixture.detectChanges();

                    expect(router.navigate).toHaveBeenCalledWith(['']);
                }
            ))
        );
    });

    describe('LoginForm: before display', () => {
        it('checks if the user is logged in before displaying itself', () => {
            spyOn(AuthService, 'isLoggedIn').and.returnValue(true);
            let fixture = TestBed.createComponent(LoginForm);
            fixture.detectChanges();
            expect(AuthService.isLoggedIn).toHaveBeenCalled();
        });
        it('redirects the user to the home page if user is already logged in',
            inject([Router], fakeAsync(
                (router: MockRouter) => {
                    spyOn(AuthService, 'isLoggedIn').and.returnValue(true);
                    expect(router.navigate).toHaveBeenCalledWith(['']);
                }
            ))
        );
    });
});
