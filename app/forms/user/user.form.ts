import {Component, OnInit, Output, EventEmitter, ViewChild, Input} from '@angular/core';
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
    @Input() user: User;

    formValues: any;
    userFormGroup: FormGroup;

    formValid: boolean;

    formErrors: any;
    submitButtonLabel: string;

    typeOptions: Array<{value:string, name: string}> = [];
    readonly currentYear = moment().year();
    readonly monthLabels = [
        "Januar",    "Februar", "Mart",     "April",
        "Maj",       "Jun",     "Jul",      "Avgust",
        "Septembar", "Oktobar", "Novembar", "Decembar"
    ];

    constructor(
        private formBuilder: FormBuilder,
        private userFormValidator: UserFormValidator
    ) { }

    ngOnInit() {
        this.submitButtonLabel = this.user ? 'Ažuriraj' : 'Kreiraj';
        this.createFormGroup();
        this.formValid = true;

        userTypeTitles.forEach((value, key) => {
            this.typeOptions.push({value: key, name: value});
        });

        this.validateForm();

        this.userFormGroup.valueChanges.subscribe(_ => this.validateForm());
    }

    private createFormGroup() {
        this.initFormValues();
        const emailRegexp = "^[a-z0-9!#$%&'*+\\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$";
        const phoneRegexp = "^\\+?[0-9\\(\\) -]*$";
        this.userFormGroup = this.formBuilder.group({
            type: [this.formValues.type, Validators.required],
            name: [this.formValues.name, Validators.required],
            surname: [this.formValues.surname, Validators.required],
            username: [this.formValues.username, Validators.required],
            password: [this.formValues.password, [Validators.required, Validators.minLength(5)]],
            passwordConfirm: [this.formValues.passwordConfirm, [Validators.required]],
            birthday: this.formBuilder.group({
                day: [this.formValues.birthdayDay, Validators.required],
                month: [this.formValues.birthdayMonth, Validators.required],
                year: [this.formValues.birthdayYear, Validators.required],
            }),
            phone: [this.formValues.phone, [Validators.required, Validators.pattern(phoneRegexp)]],
            email: [this.formValues.email, [Validators.required, Validators.pattern(emailRegexp)]],
        }, {validator: Validators.compose([this.passwordMatchValidator, this.birthdayValidator])});
    }

    private initFormValues() {
        if(!this.user) {
            this.formValues = {
                type: '',
                name: '',
                surname: '',
                username: '',
                password: '',
                passwordConfirm: '',
                birthdayDay: '',
                birthdayMonth: '',
                birthdayYear: '',
                phone: '',
                email: ''
            };
            return;
        }

        this.formValues = {};
        this.formValues.type = this.user.type;
        this.formValues.name = this.user.name;
        this.formValues.surname = this.user.surname;
        this.formValues.username = this.user.username;
        this.formValues.password = this.user.password;
        this.formValues.passwordConfirm = this.user.password;
        this.formValues.birthdayDay = this.user.birthday.getDate();
        this.formValues.birthdayMonth = this.user.birthday.getMonth()+1;
        this.formValues.birthdayYear = this.user.birthday.getFullYear();
        this.formValues.phone = this.user.phone;
        this.formValues.email = this.user.email;
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

        this.onUserCreated.emit(newUser);
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
