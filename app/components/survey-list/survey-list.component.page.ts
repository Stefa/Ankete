import {Page} from "../../test/page";
import {DebugElement} from "@angular/core";

export class SurveyListPage extends Page {
    nameHeader;
    startHeader;
    endHeader;

    surveyRows;
    surveyRowsDebugElements;

    constructor(surveyListDebugElement: DebugElement) {
        super(surveyListDebugElement);
        [this.nameHeader, this.startHeader, this.endHeader] = this.getAllDebugElementsByCss('th:not(.action-header)');
    }

    getSurveyRows() {
        this.surveyRows = this.getAllElementsByCss('.survey');
    }

    getSurveyRowsDebugElements() {
        this.surveyRowsDebugElements = this.getAllDebugElementsByCss('.survey');
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