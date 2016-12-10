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
import {leonardoUserResponse, leonardoUserObject} from '../test/users';
import {By} from "@angular/platform-browser";
import {MockBackend, MockConnection} from "@angular/http/testing";
import {Component} from "@angular/core";
import {Router} from "@angular/router";

@Component({
    selector: 'root-cmp',
    template: `<router-outlet></router-outlet>`
})
class RootCmp {}

describe('LoginFromIntegration', () => {
    const apiUrl = 'http://localhost:3210';
    let rootFixture;

    function setInput(inputElemtn, value) {
        inputElemtn.value = value;
        inputElemtn.dispatchEvent(new Event('input'));
    }

    function submitForm(form) {
        form.dispatchEvent(new Event('submit'));
    }

    function advance() {
        tick();
        rootFixture.detectChanges();
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

    beforeEach(() => {

    });

    afterEach(() => localStorage.clear());

    it('will go to home page when logged in with correct user',
        inject([MockBackend, Location, Router], fakeAsync((backand: MockBackend, location: Location, router: Router) => {
            rootFixture = TestBed.createComponent(RootCmp);
            advance();

            router.initialNavigation();
            advance();
            expect(location.path()).toBe('/login');

            let getUrl = apiUrl+'/users?username=Leo&password=turtlePower';
            backand.connections.subscribe((connection: MockConnection) => {
                expect(connection.request.url).toBe(getUrl);
                let response: ResponseOptions = new ResponseOptions({body: JSON.stringify([leonardoUserObject])});
                connection.mockRespond(new Response(response));
            });

            let loginFormDebugElement = rootFixture.debugElement.children[1];
            let usernameInput = loginFormDebugElement.query(By.css('#username')).nativeElement;
            let passwordInput = loginFormDebugElement.query(By.css('#password')).nativeElement;
            let form = loginFormDebugElement.query(By.css('form')).nativeElement;
            rootFixture.detectChanges();
            setInput(usernameInput, 'Leo');
            setInput(passwordInput, 'turtlePower');

            advance();
            submitForm(form);

            tick();
            expect(location.path()).toEqual('/');
        }))
    );

    it('will stay at login page and show the error message if login was tried with wrong credentials',
        inject([MockBackend, Location, Router], fakeAsync((backand: MockBackend, location: Location, router: Router) => {
            rootFixture = TestBed.createComponent(RootCmp);
            advance();

            router.initialNavigation();
            advance();

            backand.connections.subscribe((connection: MockConnection) => {
                let response: ResponseOptions = new ResponseOptions({body: '[]'});
                connection.mockRespond(new Response(response));
            });

            let loginFormDebugElement = rootFixture.debugElement.children[1];
            let usernameInput = loginFormDebugElement.query(By.css('#username')).nativeElement;
            let passwordInput = loginFormDebugElement.query(By.css('#password')).nativeElement;
            let form = loginFormDebugElement.query(By.css('form')).nativeElement;
            rootFixture.detectChanges();
            setInput(usernameInput, 'Leo');
            setInput(passwordInput, '7uRt13P0vEr');

            advance();
            submitForm(form);

            advance();
            expect(location.path()).toEqual('/login');
            expect(loginFormDebugElement.nativeElement.querySelector('.ui.error.message.login-form').innerHTML)
                .toContain('Pogrešno korisničko ime ili šifra!');
        }))
    );
});