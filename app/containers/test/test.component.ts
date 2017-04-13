import { Component, OnInit } from '@angular/core';
import {User} from "../../data/user.data";


@Component({
    moduleId: module.id,
    selector: 'test',
    templateUrl: 'test.component.html',
    styleUrls: ['test.component.css']
})
export class TestComponent implements OnInit {
    answers = [
        'abc',
        'def'
    ];
    constructor() { }

    ngOnInit() {

    }
}
