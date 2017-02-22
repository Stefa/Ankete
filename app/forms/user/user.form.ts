import {Component, OnInit, Output, EventEmitter, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn} from "@angular/forms";
import {UserService} from "../../services/user/user.service";
import {User, userTypeTitles} from "../../data/user.data";
import * as moment from 'moment/moment';
import {UserFormValidator} from "../../form-validators/user/user.form-validator";

@Component({
    moduleId: module.id,
    selector: 'user-form',
    templateUrl: 'user.form.html',
    styleUrls: ['user.form.css']
})
export class UserForm implements OnInit {
    @Output() onUserCreated = new EventEmitter<User>();
    @Output() onCancel = new EventEmitter();

    userFormGroup: FormGroup;

    formValid: boolean;

    formErrors: any;

    typeOptions: Array<{value:string, name: string}> = [];
    readonly currentYear = moment().year();
    readonly monthLabels = [
        "Januar",    "Februar", "Mart",     "April",
        "Maj",       "Jun",     "Jul",      "Avgust",
        "Septembar", "Oktobar", "Novembar", "Decembar"
    ];

    constructor(
        private formBuilder: FormBuilder,
        private userService: UserService,
        private userFormValidator: UserFormValidator
    ) { }

    ngOnInit() {
        this.createFormGroup();
        this.formValid = true;

        userTypeTitles.forEach((value, key) => {
            this.typeOptions.push({value: key, name: value});
        });

        this.validateForm();

        this.userFormGroup.valueChanges.subscribe(_ => this.validateForm());
    }

    private createFormGroup() {
        const emailRegexp = "^[a-z0-9!#$%&'*+\\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$";
        const phoneRegexp = "^\\+?[0-9\\(\\) -]*$";
        this.userFormGroup = this.formBuilder.group({
            type: ['', Validators.required],
            name: ['', Validators.required],
            surname: ['', Validators.required],
            username: ['', Validators.required],
            password: ['', [Validators.required, Validators.minLength(5)]],
            passwordConfirm: ['', [Validators.required]],
            birthday: this.formBuilder.group({
                day: ['', Validators.required],
                month: ['', Validators.required],
                year: ['', Validators.required],
            }),
            phone: ['', [Validators.required, Validators.pattern(phoneRegexp)]],
            email: ['', [Validators.required, Validators.pattern(emailRegexp)]],
        }, {validator: Validators.compose([this.passwordMatchValidator, this.birthdayValidator])});
    }

    validateForm() {
        this.formErrors = this.userFormValidator.validateForm(this.userFormGroup);
    }

    submit(submitValues: any) {
        this.formValid = this.userFormGroup.valid;

        this.markControlsAsDirty();
        this.validateForm();

        if(!this.formValid) return;

        let newUser = this.createUserObjectFromSubmittedValue(submitValues);

        this.userService.createUser(newUser)
            .subscribe(createdUser => this.onUserCreated.emit(createdUser));
    }

    private markControlsAsDirty() {
        for (let controlName in this.userFormGroup.controls) {
            this.userFormGroup.get(controlName).markAsDirty();
        }
    }

    private createUserObjectFromSubmittedValue(submitValues: any): User {
        let birthday = submitValues.birthday;
        let birthdayDate = new Date(Date.UTC(birthday.year, birthday.month, birthday.day));

        let newUser: User = {
            type: submitValues.type,
            name: submitValues.name,
            surname: submitValues.surname,
            username: submitValues.username,
            password: submitValues.password,
            birthday: birthdayDate,
            phone: submitValues.phone,
            email: submitValues.email
        };
        return newUser;
    }

    cancel() {
        this.onCancel.emit();
    }

    private passwordMatchValidator(g: FormGroup) {
        return g.get('password').value === g.get('passwordConfirm').value
            ? null : {'passwordMismatch': true};
    }

    private birthdayValidator: ValidatorFn = (g: FormGroup) => {
        let bg = g.get('birthday');
        if(!bg.valid) return {'birthdayRequired': true};

        return moment([bg.get('year').value, parseInt(bg.get('month').value), bg.get('day').value]).isValid()
            ? null : {'birthdayInvalid': true}
    }
}
