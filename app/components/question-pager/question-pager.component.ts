import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {checkBinding} from "@angular/core/src/linker/view_utils";

@Component({
    moduleId: module.id,
    selector: 'question-pager',
    templateUrl: 'question-pager.component.html'
})
export class QuestionPagerComponent implements OnInit {
    @Input() totalPages: number;
    @Output() onPageChanged = new EventEmitter<number>();
    currentPage: number = 1;

    previousButtonDisabled;
    nextButtonDisabled;

    constructor() { }

    ngOnInit() {
        this.checkButtonStatus();
    }

    private checkButtonStatus() {
        this.previousButtonDisabled = this.currentPage == 1;
        this.nextButtonDisabled = this.currentPage == this.totalPages;
    }

    next() {
        if(this.currentPage == this.totalPages) return;
        this.currentPage++;
        this.checkButtonStatus();
        this.onPageChanged.emit(this.currentPage);
    }

    previous() {
        if(this.currentPage == 1) return;
        this.currentPage--;
        this.checkButtonStatus();
        this.onPageChanged.emit(this.currentPage);
    }
}