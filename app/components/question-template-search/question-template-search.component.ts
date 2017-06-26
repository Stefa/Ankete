import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {QuestionTemplateService} from "../../services/question-template/question-template.service";
import {QuestionTemplate} from "../../data/questionTemplate.data";
import {QuestionService} from "../../services/question/question.service";
import {Observable} from "rxjs/Rx";
import {Question} from "../../data/question.data";

@Component({
    moduleId: module.id,
    selector: 'question-template-search',
    templateUrl: 'question-template-search.component.html'
})

export class QuestionTemplateSearchComponent implements OnInit {
    @Input() surveyId: number;
    @Output() onTemplateSelected = new EventEmitter<Question>();
    questionTemplates: Array<QuestionTemplate>;

    constructor(
        private questionTemplateService: QuestionTemplateService,
        private questionService: QuestionService
    ) {}

    ngOnInit() {
        this.questionTemplateService.getAll().subscribe(templates => {
            this.questionTemplates = templates;
            this.initSearch();
        });
    }

    private initSearch() {
        let content = this.questionTemplates.map(template => {
            return {
                title: template.text,
                id: template.id
            };
        });
        jQuery('.ui.search')
            .search({
                source: content,
                searchFields: ['title'],
                maxResults: 4,
                onSelect: this.templateSelected
            })
        ;
    }

    private templateSelected = (result, response) => {
        let selectedTemplate = this.questionTemplates.find(
            template => template.id == result.id
        );
        this.createQuestionFromTemplate(selectedTemplate)
            .subscribe(question => this.onTemplateSelected.emit(question));
    };

    private createQuestionFromTemplate(template: QuestionTemplate): Observable<Question> {
        let newQuestion: Question = jQuery.extend(true, {}, template);
        delete newQuestion.id;
        if(this.surveyId) {
            newQuestion.survey = {id: this.surveyId};
        }
        return this.questionService.createQuestion(newQuestion);
    }
}