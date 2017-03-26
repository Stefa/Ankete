import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
    moduleId: module.id,
    selector: 'survey-fill-out',
    templateUrl: 'survey-fill-out.component.html'
})
export class SurveyFillOutComponent implements OnInit {
    constructor(private route: ActivatedRoute) { }

    ngOnInit() {
        console.log(this.route.snapshot.data);
    }

}
