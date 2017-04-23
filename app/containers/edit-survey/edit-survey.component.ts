import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Survey} from "../../data/survey.data";
import {AuthService} from "../../services/authentication/auth.service";

@Component({
    moduleId: module.id,
    selector: 'edit-survey',
    templateUrl: 'edit-survey.component.html'
})
export class EditSurveyComponent implements OnInit {
    survey: Survey;
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authService: AuthService
    ) { }

    ngOnInit() {
        this.survey = this.route.snapshot.data['survey'];
    }

    finishedUpdating() {
        let currentUser = this.authService.getLoggedInUser();
        let routePath = currentUser.id == this.survey.author.id ? '/my-surveys' : '/surveys';
        this.router.navigate([routePath]);
    }
}
