import {Page} from "../../test/page";
import {DebugElement} from "@angular/core";

export class QuestionPagerComponentPage extends Page {
    previousButton;
    nextButton;

    constructor(questionPagerComponentDebugElement: DebugElement) {
        super(questionPagerComponentDebugElement);

        this.previousButton = this.getDebugElementByCss('.question-pager-previous');
        this.nextButton = this.getDebugElementByCss('.question-pager-next');
    }

    next() {
        this.click(this.nextButton);
    }

    previous() {
        this.click(this.previousButton);
    }
}