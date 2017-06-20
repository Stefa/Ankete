import { Injectable } from '@angular/core';
import {ApiService} from "../api/api.service";
import {QuestionTemplate} from "../../data/questionTemplate.data";
import {Observable} from "rxjs/Rx";

@Injectable()
export class QuestionTemplateService {
    constructor(public api: ApiService) { }

    create(questionTemplate: QuestionTemplate): Observable<QuestionTemplate> {
        let postQuestion = this.prepareQuestionTemplateForApi(questionTemplate);

        return this.api
            .post('templates', postQuestion)
            .map(this.createQuestionTemplateFromApiResponse);
    }

    private prepareQuestionTemplateForApi(questionTemplate: QuestionTemplate) {
        let postQuestionTemplate: any = Object.assign({userId: questionTemplate.author.id}, questionTemplate);
        delete postQuestionTemplate.author;

        return postQuestionTemplate;
    }

    private createQuestionTemplateFromApiResponse(response: any) {
        let questionTemplatePostResponse = Object.assign({}, response);
        let additionalFields: any = {};
        additionalFields.author = {id: questionTemplatePostResponse.userId};
        delete questionTemplatePostResponse.userId;

        return Object.assign(additionalFields, questionTemplatePostResponse);
    }

    getAll(): Observable<QuestionTemplate[]> {
        return this.api.get('templates').map((res: any) => {
            return res.map(this.createQuestionTemplateFromApiResponse);
        });
    }

}