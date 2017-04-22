import {async, TestBed, ComponentFixture, fakeAsync, inject, tick} from "@angular/core/testing";
import {TopBarComponent} from "./top-bar.component";
import {By} from "@angular/platform-browser";
import {MockRouterLinkDirective} from "../../test/mock.router-link";
import {AuthService} from "../../services/authentication/auth.service";
import {UserService} from "../../services/user/user.service";
import {ApiService} from "../../services/api/api.service";
import {HttpModule} from "@angular/http";
import {Router} from "@angular/router";
import {MockRouter} from "../../test/mock.router";
import {Observable} from 'rxjs/Rx';
import {authorUserObject, leonardoUserObject} from '../../test/users';

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

    describe('Home page link', () => {
        beforeEach(() => {
            fixture.detectChanges();

            linkDes = fixture.debugElement.queryAll(By.directive(MockRouterLinkDirective));
            links = linkDes.map(de => de.injector.get(MockRouterLinkDirective) as MockRouterLinkDirective);
        });

        it('should show the home page link', () => {
            expect(links.length).toBe(1, 'should have 3 links');
            expect(links[0].linkParams).toBe('/surveys', '1st link should go to Home page');
        });
    });

    xdescribe('My surveys link', () => {
        it('should be shown if user is author', inject(
            [AuthService], (authService: AuthService) => {
                spyOn(authService, 'getCurrentUser').and.returnValue(Observable.of(authorUserObject));
                fixture.detectChanges();

                linkDes = fixture.debugElement.queryAll(By.directive(MockRouterLinkDirective));
                links = linkDes.map(de => de.injector.get(MockRouterLinkDirective) as MockRouterLinkDirective);

                expect(links[0].linkParams).toBe('/', '1st link should go to Home page');
            }
        ));
    });

    describe('Logout button', () => {
        let logoutButton;
        function initTopBar(authService, user) {
            spyOn(authService, 'getCurrentUser').and.returnValue(Observable.of(user));
            fixture.detectChanges();
            tick();
            fixture.detectChanges();
            logoutButton = fixture.debugElement.query(By.css('.logout'));
        }
        it('should not show the logout button when user is not logged in',
            inject([AuthService], fakeAsync((authService: AuthService) => {
                initTopBar(authService, null);
                expect(logoutButton).toBeNull();
            }))
        );

        it('should show the logout button when user is logged in',
            inject([AuthService], fakeAsync((authService: AuthService) => {
                initTopBar(authService, leonardoUserObject);
                expect(logoutButton).not.toBeNull();
            }))
        );

        it('should log the user out when logout button is clicked', inject([AuthService, Router],
            fakeAsync((authService: AuthService, router: MockRouter) => {
                initTopBar(authService, leonardoUserObject);
                spyOn(authService, 'logout');

                logoutButton.triggerEventHandler('click', null);

                expect(authService.logout).toHaveBeenCalled();
                expect(router.navigate).toHaveBeenCalledWith(['/login']);
        })));
    });
});
