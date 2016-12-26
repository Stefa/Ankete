import { Injectable } from '@angular/core';
import {ApiService} from "../api/api.service";
import {Question, questionTypes} from "../../data/question.data";
import {Observable} from "rxjs";

@Injectable()
export class QuestionService {

    constructor(public api: ApiService) { }

    createQuestion(question: Question): Observable<Question> {
        this.validateQuestion(question);
        let postQuestion = this.prepareQuestionForApi(question);

        return this.api
            .post('questions', postQuestion)
            .map(this.createQuestionFromApiResponse);
    }

    private createQuestionFromApiResponse(response: any) {
        let questionPostResponse = Object.assign({}, response);
        let author: any = {id: questionPostResponse.userId};
        delete questionPostResponse.userId;

        return Object.assign({author: author}, questionPostResponse);
    }

    private prepareQuestionForApi(question: Question) {
        let postQuestion = Object.assign({userId: question.author.id}, question);
        delete postQuestion.author;
        return postQuestion;
    }

    private validateQuestion(question: Question): boolean {
        if(question.text == '') {
            throw new Error('Tekst pitanja mora biti zadat!');
        }

        if(question.author == null) {
            throw new Error('Autor pitanja mora biti postavljen!');
        }

        switch (question.type) {

            case questionTypes.numeric:
            case questionTypes.text:
                if(question.answers.length == 0) {
                    throw new Error('Tekst bar jednog polja za odgovor mora biti postavljen!');
                }
                break;

            case questionTypes.choose_one:
            case questionTypes.choose_multiple:
                if(question.answers.length < 2) {
                    throw new Error('Pitanje mora imati više ponuđenih odgovora!');
                }
                break;
        }

        return true;
    }

}
