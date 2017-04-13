import {Page} from "../../test/page";
import {DebugElement} from "@angular/core";

export class SurveyListPage extends Page {
    nameHeader;
    startHeader;
    endHeader;

    surveyRows;

    constructor(surveyListDebugElement: DebugElement) {
        super(surveyListDebugElement);
        [this.nameHeader, this.startHeader, this.endHeader] = this.getAllDebugElementsByCss('th:not(.action-header)');
    }

    getSurveyRows() {
        this.surveyRows = this.getAllEmementsByCss('.survey');
    }

    sortByName() {
        this.click(this.nameHeader);
    }

    sortByStart() {
        this.click(this.startHeader);
    }

    sortByEnd() {
        this.click(this.endHeader);
    }
}