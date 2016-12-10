import {async, TestBed, tick, fakeAsync, inject} from "@angular/core/testing";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpModule, ResponseOptions, Response, Http, ConnectionBackend, BaseRequestOptions} from "@angular/http";
import { Location } from '@angular/common';
import {LoginForm} from "../forms/login/login.form";
import {AuthService} from "../services/authentication/auth.service";
import {UserService} from "../services/user/user.service";
import {ApiService} from "../services/api/api.service";
import {RouterTestingModule} from "@angular/router/testing";
import {HomeComponent} from "../containers/home/home.component";
import {ParticipantGuard} from "../guards/participant/participant.guard";
import { leonardoUserObject } from '../test/users';
import {By} from "@angular/platform-browser";
import {MockBackend, MockConnection} from "@angular/http/testing";
import {Component, DebugElement} from "@angular/core";
import {Router} from "@angular/router";

@Component({
    selector: 'root-cmp',
    template: `<router-outlet></router-outlet>`
})
class RootCmp {}

class LoginFormPage {
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

    setUsername(username) {
        this.setInput(this.usernameInput, username);
    }
    setPassword(password) {
        this.setInput(this.passwordInput, password);
    }
    submitForm() {
        this.form.dispatchEvent(new Event('submit'));
    }
    getErrors() {
        this.formErrorElement = this.loginFormElement.querySelector('.ui.error.message.login-form');
        this.usernameErrorElement = this.loginFormElement.querySelector('.ui.error.message.username');
        this.passwordErrorElement = this.loginFormElement.querySelector('.ui.error.message.password');
    }
}

describe('LoginFromIntegration', () => {
    const apiUrl = 'http://localhost:3210';
    let rootFixture;

    function advance() {
        tick();
        rootFixture.detectChanges();
    }

    function goToLogin(router: Router) {
        rootFixture = TestBed.createComponent(RootCmp);
        advance();

        router.initialNavigation();
        advance();
    }

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                FormsModule, ReactiveFormsModule, HttpModule,
                RouterTestingModule.withRoutes([
                    {
                        path: '',
                        component: HomeComponent,
                        canActivate: [ParticipantGuard]
                    },
                    { path: 'login', component: LoginForm }
                ])
            ],
            declarations: [LoginForm, HomeComponent, RootCmp],
            providers: [
                AuthService, UserService, ApiService,
                MockBackend, BaseRequestOptions,
                ParticipantGuard,
                {
                    provide: Http,
                    useFactory: (backend: ConnectionBackend, defaultOptions: BaseRequestOptions) => {
                        return new Http(backend, defaultOptions);
                    },
                    deps: [MockBackend, BaseRequestOptions]
                }
            ]
        })
            .compileComponents();
    }));


    afterEach(() => localStorage.clear());

    it('will go to home page when logged in with correct user',
        inject([MockBackend, Location, Router], fakeAsync((backand: MockBackend, location: Location, router: Router) => {
            goToLogin(router);
            expect(location.path()).toBe('/login');

            let getUrl = apiUrl+'/users?username=Leo&password=turtlePower';
            backand.connections.subscribe((connection: MockConnection) => {
                expect(connection.request.url).toBe(getUrl);
                let response: ResponseOptions = new ResponseOptions({body: JSON.stringify([leonardoUserObject])});
                connection.mockRespond(new Response(response));
            });

            let loginFormPage = new LoginFormPage(rootFixture.debugElement.children[1]);
            loginFormPage.setUsername('Leo');
            loginFormPage.setPassword('turtlePower');

            advance();
            loginFormPage.submitForm();

            tick();
            expect(location.path()).toEqual('/');
        }))
    );

    it('will stay at login page and show the error message if login was tried with wrong credentials',
        inject([MockBackend, Location, Router], fakeAsync((backand: MockBackend, location: Location, router: Router) => {
            goToLogin(router);

            backand.connections.subscribe((connection: MockConnection) => {
                let response: ResponseOptions = new ResponseOptions({body: '[]'});
                connection.mockRespond(new Response(response));
            });

            let loginFormDebugElement = rootFixture.debugElement.children[1];

            let loginFormPage = new LoginFormPage(loginFormDebugElement);
            loginFormPage.setUsername('Leo');
            loginFormPage.setPassword('7uRt13P0vEr');

            advance();
            loginFormPage.submitForm();

            advance();
            expect(location.path()).toEqual('/login');
            loginFormPage.getErrors();
            expect(loginFormPage.formErrorElement.innerHTML).toContain('Pogrešno korisničko ime ili šifra!');
        }))
    );
});