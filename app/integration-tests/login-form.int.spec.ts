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
import {MockBackend, MockConnection} from "@angular/http/testing";
import {Component} from "@angular/core";
import {Router} from "@angular/router";
import {LoginFormPage} from "../forms/login/login.form.page";
import {By} from "@angular/platform-browser";
import {TopBarComponent} from "../components/top-bar/top-bar.component";

@Component({
    selector: 'root-cmp',
    template: `<top-bar></top-bar><router-outlet></router-outlet>`
})
class RootCmp {}


describe('LoginFromIntegration', () => {
    const apiUrl = 'http://localhost:3210';
    let rootFixture;

    function advance() {
        tick();
        rootFixture.detectChanges();
    }

    function goToLogin(router: Router) {
        rootFixture = TestBed.createComponent(RootCmp);

        router.initialNavigation();
        tick();
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
            declarations: [LoginForm, HomeComponent, TopBarComponent, RootCmp],
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

    it('should go to home page when logged in with correct user',
        inject([MockBackend, Location, Router], fakeAsync((backand: MockBackend, location: Location, router: Router) => {
            goToLogin(router);
            expect(location.path()).toBe('/login');

            let getUrl = apiUrl+'/users?username=Leo&password=turtlePower';
            backand.connections.subscribe((connection: MockConnection) => {
                expect(connection.request.url).toBe(getUrl);
                let response: ResponseOptions = new ResponseOptions({body: JSON.stringify([leonardoUserObject])});
                connection.mockRespond(new Response(response));
            });

            let loginFormPage = new LoginFormPage(rootFixture.debugElement.children[2]);
            loginFormPage.login('Leo', 'turtlePower');

            tick();
            expect(location.path()).toEqual('/');
        }))
    );

    it('should stay at login page and show the error message if login was tried with wrong credentials',
        inject([MockBackend, Location, Router], fakeAsync((backand: MockBackend, location: Location, router: Router) => {
            goToLogin(router);

            backand.connections.subscribe((connection: MockConnection) => {
                let response: ResponseOptions = new ResponseOptions({body: '[]'});
                connection.mockRespond(new Response(response));
            });

            let loginFormDebugElement = rootFixture.debugElement.children[2];

            let loginFormPage = new LoginFormPage(loginFormDebugElement);
            loginFormPage.login('Leo', '7uRt13P0vEr');

            advance();
            expect(location.path()).toEqual('/login');
            loginFormPage.getErrors();
            expect(loginFormPage.formErrorElement.innerHTML).toContain('Pogrešno korisničko ime ili šifra!');
        }))
    );

    it('should go to login page after user has logged out',
        inject([MockBackend, Location, Router], fakeAsync((backand: MockBackend, location: Location, router: Router) => {
            goToLogin(router);

            backand.connections.subscribe((connection: MockConnection) => {
                let response: ResponseOptions = new ResponseOptions({body: JSON.stringify([leonardoUserObject])});
                connection.mockRespond(new Response(response));
            });

            let loginFormPage = new LoginFormPage(rootFixture.debugElement.children[2]);
            loginFormPage.login('Leo', 'turtlePower');
            advance();

            let logoutButton = rootFixture.debugElement.children[0].query(By.css('.logout'));
            expect(logoutButton).not.toBeNull();

            logoutButton.triggerEventHandler('click', null);
            advance();
            expect(location.path()).toEqual('/login');
        }))
    );
});