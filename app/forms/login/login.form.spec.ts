import {TestBed, fakeAsync, inject, async} from "@angular/core/testing";
import {FormsModule, ReactiveFormsModule, FormGroup} from "@angular/forms";
import {LoginForm} from "./login.form";
import {By} from "@angular/platform-browser";
import {AuthService} from "../../services/authentication/auth.service";
import {Observable} from 'rxjs/Rx';
import {UserService} from "../../services/user/user.service";
import {ApiService} from "../../services/api/api.service";
import {HttpModule} from "@angular/http";
import {DebugElement} from "@angular/core";
import {Router} from "@angular/router";
import {MockRouter} from "../../test/mock.router";
import {LoginFormPage} from "./login.form.page";


describe('LoginFrom', () => {
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

    describe('LoginForm: before display', () => {
        it('checks if the user is logged in before displaying itself', inject(
            [AuthService],
            (authService: AuthService) => {
                spyOn(authService, 'isLoggedIn').and.returnValue(true);
                let fixture = TestBed.createComponent(LoginForm);
                fixture.detectChanges();
                expect(authService.isLoggedIn).toHaveBeenCalled();
            }
        ));
        it('redirects the user to the home page if user is already logged in',
            inject([Router, AuthService], fakeAsync(
                (router: MockRouter, authService: AuthService) => {
                    spyOn(authService, 'isLoggedIn').and.returnValue(true);
                    expect(router.navigate).toHaveBeenCalledWith(['']);
                }
            ))
        );
    });

    describe('LoginForm: behaviour', () => {
        let fixture, loginFormPage: LoginFormPage;

        beforeEach(() => {
            fixture = TestBed.createComponent(LoginForm);
            loginFormPage = new LoginFormPage(fixture.debugElement);
            fixture.detectChanges();
        });

        function submitForm(authService: AuthService, authResponse: boolean, username: string, password: string) {
            spyOn(authService, 'login').and.returnValue(Observable.of(authResponse));

            loginFormPage.login(username, password);
        }

        it('sends the request to AuthService::login() on submit if all the fields are filled',
            inject([AuthService], (authService: AuthService) => {
                submitForm(authService, true, 'Leo', 'turtlePower');

                expect(authService.login).toHaveBeenCalledWith('Leo', 'turtlePower');
            })
        );

        it('displays error message when username is missing',
            inject([AuthService], (authService: AuthService) => {
                submitForm(authService, true, '', 'turtlePower');
                loginFormPage.getErrors();

                // checking weather message is defined would also be ok
                expect(loginFormPage.usernameErrorElement.innerHTML).toContain('Unesite korisničko ime');
                expect(authService.login).not.toHaveBeenCalled();
            })
        );

        it('displays error message when password is missing',
            inject([AuthService], (authService: AuthService) => {
                submitForm(authService, true, 'Leo', '');
                loginFormPage.getErrors();

                expect(loginFormPage.passwordErrorElement.innerHTML).toContain('Unesite šifru');
                expect(authService.login).not.toHaveBeenCalled();
            })
        );
        it('displays the error message on login failure',
            inject([AuthService], (authService: AuthService) => {
                submitForm(authService, false, 'Leo', 'cowabunga');
                fixture.detectChanges();
                loginFormPage.getErrors();

                expect(loginFormPage.formErrorElement.innerHTML).toContain('Pogrešno korisničko ime ili šifra!');
            })
        );
        it('redirects the user to the home page on successful login',
            inject([AuthService, Router], (authService: AuthService, router: MockRouter) => {
                submitForm(authService, true, 'Leo', 'turtlePower');
                expect(router.navigate).toHaveBeenCalledWith(['']);
            })
        );
    });
});
