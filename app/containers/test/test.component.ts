import { Component, OnInit } from '@angular/core';
import {Question} from "../../data/question.data";

@Component({
    moduleId: module.id,
    selector: 'test',
    templateUrl: 'test.component.html',
    styleUrls: ['test.component.css']
})
export class TestComponent implements OnInit {
    constructor() { }

    ngOnInit() { }

    created(question: Question) {
        console.log('in test component', question);
    }

}
