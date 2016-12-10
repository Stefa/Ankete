import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators, AbstractControl, FormControl} from '@angular/forms';
import {AuthService} from "../../services/authentication/auth.service";
import {Router} from "@angular/router";

@Component({
    moduleId: module.id,
    selector: 'login-form',
    templateUrl: 'login.form.html'
})
export class LoginForm implements OnInit{
    loginFormGroup: FormGroup;
    usernameControl: AbstractControl;
    passwordControl: AbstractControl;
    formValid: boolean;
    authenticationError: boolean;

    constructor(fb: FormBuilder, private authService: AuthService, private router: Router) {
        this.loginFormGroup = fb.group({
            'username': ['', Validators.required],
            'password': ['', Validators.required]
        });
        this.usernameControl = this.loginFormGroup.controls['username'];
        this.passwordControl = this.loginFormGroup.controls['password'];
        this.formValid = true;
        this.authenticationError = false;
    }

    ngOnInit(): void {
        if(this.authService.isLoggedIn()) {
            this.router.navigate(['']);
        }
    }

    submit(submitValues: any) {
        this.formValid = this.loginFormGroup.valid;
        if(!this.formValid) {
            return;
        }

        this.authService.login(submitValues.username, submitValues.password).subscribe(
            (res: boolean) => {
                this.authenticationError = !res;
                this.formValid = res;
                if(res) {
                    this.router.navigate(['']);
                }
            },
            () => {
                this.authenticationError = true;
                this.formValid = false;
            }
        );
    }
}
