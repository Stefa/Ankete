import {Component, OnInit, Input} from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'form-error',
    templateUrl: 'form-error.component.html',
    styleUrls: ['form-error.component.css']
})
export class FormErrorComponent implements OnInit {
    @Input() error: {css: string, message: string};
    constructor() {
    }

    ngOnInit() {
    }
}
