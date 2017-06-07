import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {UserService} from "../../services/user/user.service";
import {User} from "../../data/user.data";
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../services/authentication/auth.service";
import {Router} from "@angular/router";

@Component({
    moduleId: module.id,
    selector: 'change-password-form',
    templateUrl: 'change-password.form.html'
})
export class ChangePasswordForm implements OnInit {
    @Output() onPasswrodChanged = new EventEmitter<User>();
    @Output() onCancel = new EventEmitter();

    formGroup1: FormGroup;
    oldPasswordControl: AbstractControl;
    newPasswordControl: AbstractControl;
    passwordConfirmControl: AbstractControl;

    wrongPasswordError: {css: string, message: string};

    formValid: boolean = true;
    authenticationError: boolean;

    formErrors: any;

    constructor(
        private formBuilder: FormBuilder,
        private userService: UserService,
        private authService: AuthService,
        private router: Router
    ) {}

    ngOnInit() {
        this.formGroup1 = this.formBuilder.group(
            {
                oldPassword: ['', Validators.required],
                newPassword: ['', Validators.required],
                passwordConfirm: ['', Validators.required],
            },
            {validator: this.passwordMatchValidator}
        );

        this.oldPasswordControl = this.formGroup1.controls['oldPassword'];
        this.newPasswordControl = this.formGroup1.controls['newPassword'];
        this.passwordConfirmControl = this.formGroup1.controls['passwordConfirm'];
    }

    private passwordMatchValidator(g: FormGroup) {
        return g.get('newPassword').value === g.get('passwordConfirm').value
            ? null : {'passwordMismatch': true};
    }

    submit(submitValues: any) {
        this.authenticationError = false;
        this.formValid = this.formGroup1.valid;
        if(!this.formValid) {
            return;
        }

        let currentUser = this.authService.getLoggedInUser();
        this.userService.changePassword(currentUser.id, submitValues.oldPassword, submitValues.newPassword)
            .subscribe(
                usr => this.logout(),
                error => this.authenticationError = true
            )
    }

    cancel() {
        this.router.navigate(['']);
    }

    private logout() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
}
