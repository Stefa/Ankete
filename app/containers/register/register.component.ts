import { Component, OnInit } from '@angular/core';
import {RegistrationService} from "../../services/registration/registration.service";
import {Router} from "@angular/router";

@Component({
    moduleId: module.id,
    selector: 'register',
    templateUrl: 'register.component.html'
})
export class RegisterComponent implements OnInit {
    constructor(private registrationService: RegistrationService, private router: Router) { }

    ngOnInit() { }

    onUserFormSubmit(userObject) {
        this.registrationService.createRegistration(userObject).subscribe(
            created => this.router.navigate(['/login'])
        );
    }

    onUserFormCancel() {
        this.router.navigate(['/login']);
    }
}
