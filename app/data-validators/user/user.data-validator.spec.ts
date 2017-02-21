import {leonardoUserObject, leonardoUserResponse} from "../../test/users";
import {UserDataValidator} from "./user.data-validator";

describe('UserDataValidator', () => {
    let testUser;
    let userDataValidator: UserDataValidator;
    beforeEach(() => {
        testUser = Object.assign({}, leonardoUserObject);
    });

    describe('checkIfUserObjectHasRequiredFields', () => {
        it('should return true if user object has all fields', () => {
            userDataValidator = new UserDataValidator(testUser);
            let valid = userDataValidator.checkIfUserObjectHasRequiredFields();
            expect(valid).toBe(true);
        });

        it('should return true if only id is missing from user object', () => {
            delete testUser.id;
            userDataValidator = new UserDataValidator(testUser);
            let valid = userDataValidator.checkIfUserObjectHasRequiredFields();
            expect(valid).toBe(true);
        });

        it('should return false if type field is missing', () => {
            delete testUser.type;
            userDataValidator = new UserDataValidator(testUser);
            let valid = userDataValidator.checkIfUserObjectHasRequiredFields();
            expect(valid).toBe(false);
        });

        it('should return false if name field is missing', () => {
            delete testUser.name;
            userDataValidator = new UserDataValidator(testUser);
            let valid = userDataValidator.checkIfUserObjectHasRequiredFields();
            expect(valid).toBe(false);
        });

        it('should return false if surname field is missing', () => {
            delete testUser.surname;
            userDataValidator = new UserDataValidator(testUser);
            let valid = userDataValidator.checkIfUserObjectHasRequiredFields();
            expect(valid).toBe(false);
        });

        it('should return false if username field is missing', () => {
            delete testUser.username;
            userDataValidator = new UserDataValidator(testUser);
            let valid = userDataValidator.checkIfUserObjectHasRequiredFields();
            expect(valid).toBe(false);
        });

        it('should return false if password field is missing', () => {
            delete testUser.password;
            userDataValidator = new UserDataValidator(testUser);
            let valid = userDataValidator.checkIfUserObjectHasRequiredFields();
            expect(valid).toBe(false);
        });

        it('should return false if birthday field is missing', () => {
            delete testUser.birthday;
            userDataValidator = new UserDataValidator(testUser);
            let valid = userDataValidator.checkIfUserObjectHasRequiredFields();
            expect(valid).toBe(false);
        });

        it('should return false if phone field is missing', () => {
            delete testUser.phone;
            userDataValidator = new UserDataValidator(testUser);
            let valid = userDataValidator.checkIfUserObjectHasRequiredFields();
            expect(valid).toBe(false);
        });

        it('should return false if email field is missing', () => {
            delete testUser.email;
            userDataValidator = new UserDataValidator(testUser);
            let valid = userDataValidator.checkIfUserObjectHasRequiredFields();
            expect(valid).toBe(false);
        });
    });
    describe('checkIfUserObjectHasAllFields', () => {
        it('should return true if user object has all fields', () => {
            userDataValidator = new UserDataValidator(testUser);
            let valid = userDataValidator.checkIfUserObjectHasAllFields();
            expect(valid).toBe(true);
        });

        it('should return false if id is missing from user object', () => {
            delete testUser.id;
            userDataValidator = new UserDataValidator(testUser);
            let valid = userDataValidator.checkIfUserObjectHasAllFields();
            expect(valid).toBe(false);
        });

        it('should return false if type field is missing', () => {
            delete testUser.type;
            userDataValidator = new UserDataValidator(testUser);
            let valid = userDataValidator.checkIfUserObjectHasAllFields();
            expect(valid).toBe(false);
        });

        it('should return false if name field is missing', () => {
            delete testUser.name;
            userDataValidator = new UserDataValidator(testUser);
            let valid = userDataValidator.checkIfUserObjectHasAllFields();
            expect(valid).toBe(false);
        });

        it('should return false if surname field is missing', () => {
            delete testUser.surname;
            userDataValidator = new UserDataValidator(testUser);
            let valid = userDataValidator.checkIfUserObjectHasAllFields();
            expect(valid).toBe(false);
        });

        it('should return false if username field is missing', () => {
            delete testUser.username;
            userDataValidator = new UserDataValidator(testUser);
            let valid = userDataValidator.checkIfUserObjectHasAllFields();
            expect(valid).toBe(false);
        });

        it('should return false if password field is missing', () => {
            delete testUser.password;
            userDataValidator = new UserDataValidator(testUser);
            let valid = userDataValidator.checkIfUserObjectHasAllFields();
            expect(valid).toBe(false);
        });

        it('should return false if birthday field is missing', () => {
            delete testUser.birthday;
            userDataValidator = new UserDataValidator(testUser);
            let valid = userDataValidator.checkIfUserObjectHasAllFields();
            expect(valid).toBe(false);
        });

        it('should return false if phone field is missing', () => {
            delete testUser.phone;
            userDataValidator = new UserDataValidator(testUser);
            let valid = userDataValidator.checkIfUserObjectHasAllFields();
            expect(valid).toBe(false);
        });

        it('should return false if email field is missing', () => {
            delete testUser.email;
            userDataValidator = new UserDataValidator(testUser);
            let valid = userDataValidator.checkIfUserObjectHasAllFields();
            expect(valid).toBe(false);
        });
    });
    describe('checkIfUserApiResponseIsValid', () => {
        let testUserResponse;
        beforeEach(() => {
            testUserResponse = Object.assign({}, leonardoUserResponse);
        });
        it('should return true provided the valid user response', () => {
            userDataValidator = new UserDataValidator(testUserResponse);
            let valid = userDataValidator.checkIfUserApiResponseIsValid();
            expect(valid).toBe(true);
        });
        it('should call checkIfUserObjectHasAllFields', () => {
            userDataValidator = new UserDataValidator(testUserResponse);
            spyOn(userDataValidator, 'checkIfUserObjectHasAllFields').and.returnValue(true);

            userDataValidator.checkIfUserApiResponseIsValid();
            expect(userDataValidator.checkIfUserObjectHasAllFields).toHaveBeenCalled();
        });
        it('should return false if any of the user fields are missing', () => {
            userDataValidator = new UserDataValidator(testUserResponse);
            spyOn(userDataValidator, 'checkIfUserObjectHasAllFields').and.returnValue(false);

            let valid = userDataValidator.checkIfUserApiResponseIsValid();
            expect(valid).toBe(false);
        });
        it('should return false if birthday is not valid date string', () => {
            userDataValidator = new UserDataValidator(testUserResponse);
            testUserResponse.birthday = 'invalid date string';
            let valid = userDataValidator.checkIfUserApiResponseIsValid();
            expect(valid).toBe(false);
        });
    });
});
