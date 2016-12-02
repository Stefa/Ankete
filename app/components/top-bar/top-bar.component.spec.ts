import {async, TestBed, ComponentFixture, fakeAsync, inject, tick} from "@angular/core/testing";
import {TopBarComponent} from "./top-bar.component";
import {By} from "@angular/platform-browser";
import {MockRouterLinkDirective} from "../../test/mock.router-link";
import {AuthService} from "../../services/authentication/AuthService";
import {UserService} from "../../services/user/UserService";
import {ApiService} from "../../services/api/ApiService";
import {HttpModule} from "@angular/http";
import {Router} from "@angular/router";
import {MockRouter} from "../../test/mock.router";
import {Observable} from 'rxjs/Rx';
import { leonardoUserObject } from '../../test/users';

describe('TopBar', () => {
    let fixture: ComponentFixture<TopBarComponent>;
    let comp: TopBarComponent;
    let linkDes;
    let links: MockRouterLinkDirective[];

    beforeEach( async(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule],
            declarations: [
                TopBarComponent,
                MockRouterLinkDirective
            ],
            providers: [
                AuthService, UserService, ApiService,
                {provide: Router, useClass: MockRouter}
            ]
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(TopBarComponent);
                comp    = fixture.componentInstance;
            });
    }));

    describe('home page link', () => {
        beforeEach(() => {
            // trigger initial data binding
            fixture.detectChanges();

            // find DebugElements with an attached RouterLinkStubDirective
            linkDes = fixture.debugElement.queryAll(By.directive(MockRouterLinkDirective));

            // get the attached link directive instances using the DebugElement injectors
            links = linkDes.map(de => de.injector.get(MockRouterLinkDirective) as MockRouterLinkDirective);
        });

        it('shows the home page link', () => {
            expect(links.length).toBe(1, 'should have 3 links');
            expect(links[0].linkParams).toBe('/', '1st link should go to Home page');
        });
    });

    describe('logout button', () => {
        let logoutButton;
        function initTopBar(authService, user) {
            spyOn(authService, 'getCurrentUser').and.returnValue(Observable.of(user));
            fixture.detectChanges();
            tick();
            fixture.detectChanges();
            logoutButton = fixture.debugElement.query(By.css('.logout'));
        }
        it('is not shown when user is not logged in', inject([AuthService], fakeAsync((authService: AuthService) => {
            initTopBar(authService, null);
            expect(logoutButton).toBeNull();
        })));

        it('is shown when user is logged in', inject([AuthService], fakeAsync((authService: AuthService) => {
            initTopBar(authService, leonardoUserObject);
            expect(logoutButton).not.toBeNull();
        })));

        it('logs the user out when clicked', inject([AuthService, Router],
            fakeAsync((authService: AuthService, router: MockRouter) => {
                initTopBar(authService, leonardoUserObject);
                spyOn(authService, 'logout');

                logoutButton.triggerEventHandler('click', null);

                expect(authService.logout).toHaveBeenCalled();
                expect(router.navigate).toHaveBeenCalledWith(['/login']);
        })));
    });
});
