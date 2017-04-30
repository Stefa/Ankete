import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Registration} from "../../data/registration.data";
import {userTypeTitles} from "../../data/user.data";
import {UserService} from "../../services/user/user.service";
import {RegistrationService} from "../../services/registration/registration.service";

@Component({
    moduleId: module.id,
    selector: 'registrations',
    templateUrl: 'registrations.component.html'
})
export class RegistrationsComponent implements OnInit, AfterViewInit {
    registrations: Registration[];
    userTypeTitles = userTypeTitles;
    constructor(
        private route: ActivatedRoute,
        private userService: UserService,
        private registrationService: RegistrationService
    ) {}

    ngOnInit() {
        this.registrations = this.route.snapshot.data['registrations']
    }

    ngAfterViewInit() {
        $('.ui.accordion').accordion();
    }

    approveRegistration(registrationIndex) {
        this.userService.createUser(this.registrations[registrationIndex]).subscribe(
            user => this.deleteRegistration(registrationIndex)
        );
    }

    denyRegistration(registrationIndex) {
        this.deleteRegistration(registrationIndex);
    }

    private deleteRegistration(index) {
        this.registrationService.deleteRegistration(this.registrations[index].id).subscribe();
        this.registrations.splice(index, 1);
    }
}
