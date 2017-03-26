import { Component, OnInit } from '@angular/core';
import {User} from "../../data/user.data";
import {Progress} from "../../data/progress.data";
import {ProgressService} from "../../services/progress/progress.service";
import {AnswerService} from "../../services/answer/answer.service";
import {Answer} from "../../data/answer.data";
import {ApiService} from "../../services/api/api.service";
import {SurveyService} from "../../services/survey/survey.service";


@Component({
    moduleId: module.id,
    selector: 'test',
    templateUrl: 'test.component.html',
    styleUrls: ['test.component.css']
})
export class TestComponent implements OnInit {
    constructor(private progressService: ProgressService) { }

    ngOnInit() {
        // let newOrder = {"questionOrder": [
        //     56,
        //     57,
        //     58,
        //     61,
        //     59,
        //     60,
        // ]};
        // this.apiService.patch('surveys/7', newOrder).subscribe(su => console.log(su));
        this.progressService.getProgressWithAnswersById(1).subscribe(
            su => console.log(su),
            e => console.log(e.message)
        );

    }

    onUserCreated(user: User) {
        console.log('User has been created', user);
    }

    onUserCanceled() {
        console.log('User has been canceled');
    }
}
