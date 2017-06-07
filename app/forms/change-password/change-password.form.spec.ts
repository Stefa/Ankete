import {ChangePasswordForm} from "./change-password.form";
import {async, ComponentFixture, inject, TestBed} from "@angular/core/testing";
import {UserService} from "../../services/user/user.service";
import {ChangePasswordFormPage} from "./change-password.form.page";
import {Observable} from "rxjs/Rx";
import {participantUserObject} from "../../test/users";
import {AuthService} from "../../services/authentication/auth.service";
import {ApiService} from "../../services/api/api.service";
import {HttpModule} from "@angular/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {FormErrorComponent} from "../../components/form-error/form-error.component";
import {Router} from "@angular/router";
import {MockRouter} from "../../test/mock.router";

describe('ChangePasswordForm', () => {
    let fixture: ComponentFixture<ChangePasswordForm>;
    let comp: ChangePasswordForm;
    let page: ChangePasswordFormPage;
    const mockRouter = new MockRouter();

    beforeEach( async(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule, FormsModule, ReactiveFormsModule],
            declarations: [ChangePasswordForm, FormErrorComponent],
            providers: [
                UserService, AuthService, ApiService,
                {provide: Router, useValue: mockRouter}
            ]
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(ChangePasswordForm);
                comp    = fixture.componentInstance;
                fixture.detectChanges();
                page = new ChangePasswordFormPage(fixture.debugElement);
            });
    }));

    function submitForm(oldPassword, newPassword, newPasswordConfirm) {
        page.setOldPassword(oldPassword);
        page.setNewPassword(newPassword);
        page.setNewPasswordConfirm(newPasswordConfirm);
        page.submitForm();
    }

    it('should call UserService\s change password method on successful submit', inject([UserService, AuthService],
        (userService: UserService, authService: AuthService) => {
            let oldPassword = 'partPass';
            let newPassword = 'p4r7P455';

            spyOn(authService, 'getLoggedInUser').and.returnValue(participantUserObject);

            let serviceReturnUser = $.extend(true, {}, participantUserObject);
            serviceReturnUser.password = newPassword;
            spyOn(userService, 'changePassword').and.returnValue(Observable.of(serviceReturnUser));

            submitForm(oldPassword, newPassword, newPassword);

            expect(userService.changePassword).toHaveBeenCalledWith(participantUserObject.id, oldPassword, newPassword);
        }
    ));

    it('should display an error if any of the fields is not populated', inject([UserService, AuthService],
        (userService: UserService, authService: AuthService) => {
            let oldPassword = 'partPass';
            let newPassword = 'p4r7P455';

            spyOn(authService, 'getLoggedInUser').and.returnValue(participantUserObject);
            spyOn(userService, 'changePassword').and.returnValue(Observable.of(null));

            submitForm(oldPassword, newPassword, '');
            page.getErrors();

            expect(page.passwordConfirmEmptyErrorElement.innerHTML).toContain('Unesite potvrdu lozinke.');
        }
    ));

    it('should display error when old password is not correct', inject([UserService, AuthService],
        (userService: UserService, authService: AuthService) => {
            let oldPassword = 'patPass';
            let newPassword = 'p4r7P455';

            spyOn(authService, 'getLoggedInUser').and.returnValue(participantUserObject);
            spyOn(userService, 'changePassword').and.returnValue(Observable.throw('Uneta je pogrešna prethodna lozinka.'));

            submitForm(oldPassword, newPassword, newPassword);
            fixture.detectChanges();
            page.getErrors();

            expect(page.wrongPasswordErrorElement.innerHTML).toContain('Unesena je pogrešna trenutna lozinka.');
        }
    ));
});
