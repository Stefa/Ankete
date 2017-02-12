import {Component, OnInit, Output, EventEmitter, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn} from "@angular/forms";
import {UserService} from "../../services/user/user.service";
import {User, userTypeTitles} from "../../data/user.data";
import * as moment from 'moment/moment';

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

    typeControl: AbstractControl;
    nameControl: AbstractControl;
    surnameControl: AbstractControl;
    usernameControl: AbstractControl;
    passwordControl: AbstractControl;
    passwordConfirmControl: AbstractControl;
    birthdayControl: FormGroup;
    dayControl: AbstractControl;
    monthControl: AbstractControl;
    yearControl: AbstractControl;
    phoneControl: AbstractControl;
    emailControl: AbstractControl;

    formValid: boolean;

    typeOptions: Array<{value:string, name: string}> = [];
    readonly currentYear = moment().year();
    readonly monthLabels = [
        "Januar",    "Februar", "Mart",     "April",
        "Maj",       "Jun",     "Jul",      "Avgust",
        "Septembar", "Oktobar", "Novembar", "Decembar"
    ];

    constructor(private formBuilder: FormBuilder, private userService: UserService) { }

    ngOnInit() {
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

        this.typeControl = this.userFormGroup.controls['type'];
        this.nameControl = this.userFormGroup.controls['name'];
        this.surnameControl = this.userFormGroup.controls['surname'];
        this.usernameControl = this.userFormGroup.controls['username'];
        this.passwordControl = this.userFormGroup.controls['password'];
        this.passwordConfirmControl = this.userFormGroup.controls['passwordConfirm'];

        this.birthdayControl = <FormGroup>this.userFormGroup.controls['birthday'];
        this.dayControl = this.birthdayControl.controls['day'];
        this.monthControl = this.birthdayControl.controls['month'];
        this.yearControl = this.birthdayControl.controls['year'];

        this.phoneControl = this.userFormGroup.controls['phone'];
        this.emailControl = this.userFormGroup.controls['email'];

        this.formValid = true;

        userTypeTitles.forEach((value, key) => {
            this.typeOptions.push({value: key, name: value});
        });
    }

    submit(submitValues: any) {
        this.formValid = this.userFormGroup.valid;

        if(!this.formValid) {
            return;
        }

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

        this.userService.createUser(newUser)
            .subscribe(createdUser => this.onUserCreated.emit(createdUser));
    }

    cancel(event) {
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
