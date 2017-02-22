import {async, TestBed, inject, ComponentFixture} from "@angular/core/testing";
import {FormsModule, ReactiveFormsModule, FormGroup} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {UserForm} from "./user.form";
import {UserService} from "../../services/user/user.service";
import {ApiService} from "../../services/api/api.service";
import {AuthService} from "../../services/authentication/auth.service";
import {By} from "@angular/platform-browser";
import {DebugElement} from "@angular/core";
import {userTypeTitles, userTypes, User} from "../../data/user.data";
import {UserFormPage} from "./user.form.page";
import {formInputUser, fibonacciUserObject} from "../../test/users";
import {Observable} from 'rxjs/Rx';
import {FormErrorComponent} from "../../components/form-error/form-error.component";
import {UserFormValidator} from "../../form-validators/user/user.form-validator";

describe('UserForm', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [FormsModule, ReactiveFormsModule, HttpModule],
            declarations: [UserForm, FormErrorComponent],
            providers: [
                UserService, ApiService, AuthService, UserFormValidator
            ]
        })
            .compileComponents();
    }));

    describe('UserForm: display', () => {
        let fixture;
        let component;
        beforeEach( () => {
            fixture = TestBed.createComponent(UserForm);
            component = fixture.componentInstance;
            fixture.detectChanges();
        });

        it('should have a defined component', () => {
            expect(component).toBeDefined();
        });
        it('should create a FormGroup', () => {
            expect(component.userFormGroup instanceof FormGroup).toBe(true);
        });
        it('should have a type field', () => {
            let typeSelect = fixture.debugElement.query(By.css('.user-type'));
            expect(typeSelect instanceof DebugElement).toBe(true);
        });
        it('should have all user type options in type field', () => {
            fixture.detectChanges();
            let typeSelectOptions = fixture.debugElement.queryAll(By.css('.user-type option'));
            expect(typeSelectOptions.length).toBe(5);
            typeSelectOptions.shift();
            for(let option of typeSelectOptions) {
                let value = option.nativeElement.value;
                let text = option.nativeElement.text;
                expect(userTypeTitles.get(value)).toEqual(text);
            }
        });
        it('should have a name field', () => {
            let textInput = fixture.debugElement.query(By.css('.user-name'));
            expect(textInput instanceof DebugElement).toBe(true);
        });
        it('should have a surname field', () => {
            let textInput = fixture.debugElement.query(By.css('.user-surname'));
            expect(textInput instanceof DebugElement).toBe(true);
        });
        it('should have a username field', () => {
            let textInput = fixture.debugElement.query(By.css('.user-username'));
            expect(textInput instanceof DebugElement).toBe(true);
        });
        it('should have a password field', () => {
            let textInput = fixture.debugElement.query(By.css('.user-password'));
            expect(textInput instanceof DebugElement).toBe(true);
        });
        it('should have a password confirmation field', () => {
            let textInput = fixture.debugElement.query(By.css('.user-password-confirm'));
            expect(textInput instanceof DebugElement).toBe(true);
        });
        it('should have a birthday day field', () => {
            let textInput = fixture.debugElement.query(By.css('.user-birthday-day'));
            expect(textInput instanceof DebugElement).toBe(true);
        });
        it('should have a birthday month field', () => {
            let textInput = fixture.debugElement.query(By.css('.user-birthday-month'));
            expect(textInput instanceof DebugElement).toBe(true);
        });
        it('should have all months in birthday month field', () => {
            let monthSelectOptions = fixture.debugElement.queryAll(By.css('.user-birthday-month option'));
            expect(monthSelectOptions.length).toBe(12);
            let monthLabels = [
                "Januar",    "Februar", "Mart",     "April",
                "Maj",       "Jun",     "Jul",      "Avgust",
                "Septembar", "Oktobar", "Novembar", "Decembar"
            ];
            for(let option of monthSelectOptions) {
                let value = option.nativeElement.value;
                let text = option.nativeElement.text;
                expect(monthLabels[value]).toEqual(text);
            }
        });
        it('should have a birthday year field', () => {
            let textInput = fixture.debugElement.query(By.css('.user-birthday-year'));
            expect(textInput instanceof DebugElement).toBe(true);
        });
        it('should have a phone field', () => {
            let textInput = fixture.debugElement.query(By.css('.user-phone'));
            expect(textInput instanceof DebugElement).toBe(true);
        });
        it('should have a email field', () => {
            let textInput = fixture.debugElement.query(By.css('.user-email'));
            expect(textInput instanceof DebugElement).toBe(true);
        });
        it('should show cancel button', () => {
            let cancelButton = fixture.debugElement.query(By.css('.user-cancel'));
            expect(cancelButton instanceof DebugElement).toBe(true);
        });
        it('should show save button', () => {
            let saveButton = fixture.debugElement.query(By.css('.user-save'));
            expect(saveButton instanceof DebugElement).toBe(true);
        });

    });

    describe('UserForm: submit', () => {
        let fixture: ComponentFixture<UserForm>, userFormPage: UserFormPage, createdUser;

        function submitUserForm(newUser: any) {
            userFormPage.setName(newUser.name);
            userFormPage.setType(newUser.type);
            userFormPage.setSurname(newUser.surname);
            userFormPage.setUsername(newUser.username);
            userFormPage.setPassword(newUser.password);
            userFormPage.setPasswordConfirm(newUser.passwordConfirm);
            userFormPage.setDay(newUser.day);
            userFormPage.setMonth(newUser.month);
            userFormPage.setYear(newUser.year);
            userFormPage.setPhone(newUser.phone);
            userFormPage.setEmail(newUser.email);
            fixture.detectChanges();

            userFormPage.submitForm();
        }

        function setSpies(userService: UserService, returnUser: User) {
            spyOn(userService, 'createUser').and.returnValue(Observable.of(returnUser));
        }

        beforeEach(() => {
            createdUser = null;
            fixture = TestBed.createComponent(UserForm);
            userFormPage = new UserFormPage(fixture.debugElement);
            fixture.detectChanges();
            fixture.componentInstance.onUserCreated.subscribe(
                (user: User) => {
                    createdUser = user;
                }
            );
        });

        it('should send request to UserService::createUser on valid submit', inject([UserService],
            (userService: UserService) => {
                let formInput = Object.assign({}, formInputUser);
                let newUser = Object.assign({birthday: new Date(formInput.year, formInput.month, formInput.day)}, formInput);
                ['day', 'month', 'year', 'passwordConfirm'].forEach( p => delete newUser[p] );

                setSpies(userService, fibonacciUserObject);
                submitUserForm(formInput);

                expect(userService.createUser).toHaveBeenCalledWith(newUser);
                expect(createdUser).toEqual(fibonacciUserObject);
            }
        ));

        it('should display error on submit when type is not set', inject([UserService],
            (userService: UserService) => {
                let formInput = Object.assign({}, formInputUser);
                delete formInput.type;

                setSpies(userService, null);
                submitUserForm(formInput);
                fixture.detectChanges();
                userFormPage.getErrors();

                expect(userService.createUser).not.toHaveBeenCalled();
                expect(createdUser).toBe(null);
                expect(userFormPage.typeMissingErrorElement.innerHTML).toContain('Izaberite tip korisnika.');
            }
        ));
        it('should display error on submit when name is not set', inject([UserService],
            (userService: UserService) => {
                let formInput = Object.assign({}, formInputUser);
                formInput.name = '';
                setSpies(userService, null);
                submitUserForm(formInput);
                fixture.detectChanges();
                userFormPage.getErrors();

                expect(userService.createUser).not.toHaveBeenCalled();
                expect(createdUser).toBe(null);
                expect(userFormPage.nameMissingErrorElement.innerHTML).toContain('Unesite ime korisnika.');
            }
        ));
        it('should display error on submit when surname is not set', inject([UserService],
            (userService: UserService) => {
                let formInput = Object.assign({}, formInputUser);
                formInput.surname = '';

                setSpies(userService, null);
                submitUserForm(formInput);
                fixture.detectChanges();
                userFormPage.getErrors();

                expect(userService.createUser).not.toHaveBeenCalled();
                expect(createdUser).toBe(null);
                expect(userFormPage.surnameMissingErrorElement.innerHTML).toContain('Unesite prezime korisnika.');
            }
        ));
        it('should display error on submit when username is not set', inject([UserService],
            (userService: UserService) => {
                let formInput = Object.assign({}, formInputUser);
                formInput.username = '';

                setSpies(userService, null);
                submitUserForm(formInput);
                fixture.detectChanges();
                userFormPage.getErrors();

                expect(userService.createUser).not.toHaveBeenCalled();
                expect(createdUser).toBe(null);
                expect(userFormPage.usernameMissingErrorElement.innerHTML).toContain('Unesite korisničko ime.');
            }
        ));
        it('should display error on submit when password is not set', inject([UserService],
            (userService: UserService) => {
                let formInput = Object.assign({}, formInputUser);
                formInput.password = '';

                setSpies(userService, null);
                submitUserForm(formInput);
                fixture.detectChanges();
                userFormPage.getErrors();

                expect(userService.createUser).not.toHaveBeenCalled();
                expect(createdUser).toBe(null);
                expect(userFormPage.passwordMissingErrorElement.innerHTML).toContain('Unesite lozinku korisnika.');
            }
        ));
        it('should display error on submit when password is less than five characters', inject([UserService],
            (userService: UserService) => {
                let formInput = Object.assign({}, formInputUser);
                formInput.password = '123';

                setSpies(userService, null);
                submitUserForm(formInput);
                fixture.detectChanges();
                userFormPage.getErrors();

                expect(userService.createUser).not.toHaveBeenCalled();
                expect(createdUser).toBe(null);
                expect(userFormPage.passwordLengthErrorElement.innerHTML).toContain('Minimalna dužina lozinke mora biti pet karaktera.');
            }
        ));
        it('should display error on submit when password confirmation is not set', inject([UserService],
            (userService: UserService) => {
                let formInput = Object.assign({}, formInputUser);
                formInput.passwordConfirm = '';

                setSpies(userService, null);
                submitUserForm(formInput);
                fixture.detectChanges();
                userFormPage.getErrors();

                expect(userService.createUser).not.toHaveBeenCalled();
                expect(createdUser).toBe(null);
                expect(userFormPage.passwordConfirmMissingErrorElement.innerHTML).toContain('Unesite potvrdu lozinke.');
            }
        ));
        it('should display error on submit when password confirmation does not match password', inject([UserService],
            (userService: UserService) => {
                let formInput = Object.assign({}, formInputUser);
                formInput.passwordConfirm = 'wrongpassword';

                setSpies(userService, null);
                submitUserForm(formInput);
                fixture.detectChanges();
                userFormPage.getErrors();

                expect(userService.createUser).not.toHaveBeenCalled();
                expect(createdUser).toBe(null);
                expect(userFormPage.passwordMismatchErrorElement.innerHTML).toContain('Lozinka i potvrda lozinke se ne slažu.');
            }
        ));
        it('should display error on submit when birthday day is not set', inject([UserService],
            (userService: UserService) => {
                let formInput = Object.assign({}, formInputUser);
                formInput.day = '';

                setSpies(userService, null);
                submitUserForm(formInput);
                fixture.detectChanges();
                userFormPage.getErrors();

                expect(userService.createUser).not.toHaveBeenCalled();
                expect(createdUser).toBe(null);
                expect(userFormPage.birthdayMissingErrorElement.innerHTML).toContain('Unesite datum rođenja korisnika.');
            }
        ));
        it('should display error on submit when birthday month is not set', inject([UserService],
            (userService: UserService) => {
                let formInput = Object.assign({}, formInputUser);
                formInput.month = '';

                setSpies(userService, null);
                submitUserForm(formInput);
                fixture.detectChanges();
                userFormPage.getErrors();

                expect(userService.createUser).not.toHaveBeenCalled();
                expect(createdUser).toBe(null);
                expect(userFormPage.birthdayMissingErrorElement.innerHTML).toContain('Unesite datum rođenja korisnika.');
            }
        ));
        it('should display error on submit when birthday year is not set', inject([UserService],
            (userService: UserService) => {
                let formInput = Object.assign({}, formInputUser);
                formInput.year = '';

                setSpies(userService, null);
                submitUserForm(formInput);
                fixture.detectChanges();
                userFormPage.getErrors();

                expect(userService.createUser).not.toHaveBeenCalled();
                expect(createdUser).toBe(null);
                expect(userFormPage.birthdayMissingErrorElement.innerHTML).toContain('Unesite datum rođenja korisnika.');
            }
        ));
        it('should display error on submit when birthday is not valid', inject([UserService],
            (userService: UserService) => {
                let formInput = Object.assign({}, formInputUser);
                formInput.day = 31;
                formInput.month = 1;

                setSpies(userService, null);
                submitUserForm(formInput);
                fixture.detectChanges();
                userFormPage.getErrors();

                expect(userService.createUser).not.toHaveBeenCalled();
                expect(createdUser).toBe(null);
                expect(userFormPage.birthdayInvalidErrorElement.innerHTML).toContain('Datum rođenja nije validan.');
            }
        ));
        it('should display error on submit when phone is not set', inject([UserService],
            (userService: UserService) => {
                let formInput = Object.assign({}, formInputUser);
                formInput.phone = '';

                setSpies(userService, null);
                submitUserForm(formInput);
                fixture.detectChanges();
                userFormPage.getErrors();

                expect(userService.createUser).not.toHaveBeenCalled();
                expect(createdUser).toBe(null);
                expect(userFormPage.phoneMissingErrorElement.innerHTML).toContain('Unesite kontakt telefon korisnika.');
            }
        ));
        it('should display error on submit when phone is not valid', inject([UserService],
            (userService: UserService) => {
                let formInput = Object.assign({}, formInputUser);
                formInput.phone = 'abcdefgh';

                setSpies(userService, null);
                submitUserForm(formInput);
                fixture.detectChanges();
                userFormPage.getErrors();

                expect(userService.createUser).not.toHaveBeenCalled();
                expect(createdUser).toBe(null);
                expect(userFormPage.phoneInvalidErrorElement.innerHTML).toContain('Kontakt telefon nije validan.');
            }
        ));
        it('should display error on submit when email is not set', inject([UserService],
            (userService: UserService) => {
                let formInput = Object.assign({}, formInputUser);
                formInput.email = '';

                setSpies(userService, null);
                submitUserForm(formInput);
                fixture.detectChanges();
                userFormPage.getErrors();

                expect(userService.createUser).not.toHaveBeenCalled();
                expect(createdUser).toBe(null);
                expect(userFormPage.emailMissingErrorElement.innerHTML).toContain('Unesite email adresu korisnika.');
            }
        ));
        it('should display error on submit when email is not valid', inject([UserService],
            (userService: UserService) => {
                let formInput = Object.assign({}, formInputUser);
                formInput.email = 'P Sherman, 42 Wallaby Way, Sydney';

                setSpies(userService, null);
                submitUserForm(formInput);
                fixture.detectChanges();
                userFormPage.getErrors();

                expect(userService.createUser).not.toHaveBeenCalled();
                expect(createdUser).toBe(null);
                expect(userFormPage.emailInvalidErrorElement.innerHTML).toContain('Email adresa nije validna.');
            }
        ));

        it('should emmit cancel event when cancel button is clicked', () => {
            let canceled = false;
            fixture.componentInstance.onCancel.subscribe(() => canceled = true);

            userFormPage.cancelForm();
            expect(canceled).toBe(true);
        });
    });
});
