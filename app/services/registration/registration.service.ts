import {Injectable} from "@angular/core";
import {ApiService} from "../api/api.service";
import {Registration} from "../../data/registration.data";
import {Observable} from "rxjs/Rx";
import {UserDataValidator} from "../../data-validators/user/user.data-validator";
import {UserService} from "../user/user.service";

@Injectable()
export class RegistrationService {
    constructor(private api: ApiService) {}

    createRegistration(registration: Registration): Observable<boolean> {
        let newRegistration: Registration = $.extend(true, {}, registration);
        let userValidator = new UserDataValidator(registration);
        if(!userValidator.checkIfUserObjectHasRequiredFields()) {
            return Observable.throw(new Error("Korisnik nema definisana sva obavezna polja."));
        }

        delete newRegistration.id;
        return this.api.post('registrations', newRegistration).map((res:any) => {
            let userValidator = new UserDataValidator(res);
            return userValidator.checkIfUserApiResponseIsValid();
        });
    }

    deleteRegistration(registrationId: number): Observable<boolean> {
        return this.api
            .delete('registrations/'+registrationId)
            .map(_ => true)
            .catch(error => Observable.of(false));
    }

    getRegistrations(): Observable<Array<Registration>> {
        return this.api.get('registrations')
            .map((res: any) => res.map(UserService.createUserObjectFromResponse));
    }
}
