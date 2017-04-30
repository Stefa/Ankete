import {Injectable} from "@angular/core";
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs/Rx";
import {Registration} from "../../data/registration.data";
import {RegistrationService} from "../../services/registration/registration.service";

@Injectable()
export class RegistrationsResolverGuard implements Resolve<Registration[]> {
    constructor(private registrationService: RegistrationService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Registration[]> {
        return this.registrationService.getRegistrations()
            .catch(_ => Observable.of([]));
    }
}
