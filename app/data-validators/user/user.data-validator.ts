import {Injectable} from '@angular/core';

@Injectable()
export class UserDataValidator {
    constructor(public user:any = null){}

    static readonly requiredProperties = ['type', 'name', 'surname', 'username', 'password', 'birthday', 'phone', 'email'];
    static readonly optionalProperties = ['id'];
    static readonly allProperties = UserDataValidator.requiredProperties.concat(UserDataValidator.optionalProperties);

    checkIfUserObjectHasRequiredFields():boolean {
        return UserDataValidator.requiredProperties.every(field => field in this.user);
    }

    checkIfUserObjectHasAllFields():boolean {
        return UserDataValidator.optionalProperties.every(field => field in this.user)
            && this.checkIfUserObjectHasRequiredFields();
    }

    checkIfUserApiResponseIsValid(): boolean {
        if(!this.checkIfUserObjectHasAllFields()) return false;
        if(isNaN(Date.parse(this.user.birthday))) return false;

        let objectProperties = Object.keys(this.user);

        return UserDataValidator.allProperties.sort().join() == objectProperties.sort().join();
    }

    static isValidUserProperty(property: string) {
        return UserDataValidator.allProperties.indexOf(property) === -1;
    }
}