import { Injectable } from '@angular/core';
import {FormGroup} from "@angular/forms";

@Injectable()
export class UserFormValidator {

    constructor() { }

    validateForm(userFormGroup: FormGroup) {
        if (!userFormGroup) { return; }
        let formErrors = {
            'type': [],
            'name': [],
            'surname': [],
            'username': [],
            'password': [],
            'passwordConfirm': [],
            'birthday': [],
            'phone': [],
            'email': [],
        };

        for (const field in formErrors) {
            if(!formErrors.hasOwnProperty(field)) continue;
            const control = userFormGroup.get(field);

            if(!control || !control.dirty || control.valid) continue;

            const messages = this.formControlsValidationMessages[field];
            for (const errorType in control.errors) {
                formErrors[field].push(messages[errorType]);
            }
        }

        for (const errorType in userFormGroup.errors) {
            const errors = this.formGroupValidationMessages[errorType];
            for (const field in errors) {
                if(!errors.hasOwnProperty(field)) continue;
                formErrors[field].push(errors[field]);
            }
        }

        return formErrors;
    }

    formControlsValidationMessages = {
        type: {
            required: {css: 'user-type', message: 'Izaberite tip korisnika.'}
        },
        name: {
            required: {css: "user-name", message: "Unesite ime korisnika."}
        },
        surname: {
            required: {css: "user-surname", message: "Unesite prezime korisnika."}
        },
        username: {
            required: {css: "user-username", message: "Unesite korisničko ime."}
        },
        password: {
            required: {css: "user-password", message: "Unesite lozinku korisnika."},
            minlength: {css: "user-password-length", message: "Minimalna dužina lozinke mora biti pet karaktera."}
        },
        passwordConfirm: {
            required: {css: "user-password-confirm", message: "Unesite potvrdu lozinke."}
        },
        birthday: {},
        phone: {
            required: {css: "user-phone", message: "Unesite kontakt telefon korisnika."},
            pattern: {css: "user-phone-invalid", message: "Kontakt telefon nije validan."}
        },
        email: {
            required: {css: "user-email", message: "Unesite email adresu korisnika."},
            pattern: {css: "user-email-invalid", message: "Email adresa nije validna."}
        },
    };

    formGroupValidationMessages = {
        passwordMismatch: {
            passwordConfirm: {css: "user-password-mismatch", message: "Lozinka i potvrda lozinke se ne slažu."}
        },
        birthdayRequired: {
            birthday: {css: "user-birthday", message: "Unesite datum rođenja korisnika."}
        },
        birthdayInvalid: {
            birthday: {css: "user-birthday-invalid", message: "Datum rođenja nije validan."}
        }
    };

}
