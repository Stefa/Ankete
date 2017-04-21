import { Injectable } from '@angular/core';
import {ApiService} from "../api/api.service";
import {Question, questionTypes} from "../../data/question.data";
import {Observable} from "rxjs/Rx";

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

    public createQuestionFromApiResponse(response: any) {
        let questionPostResponse = Object.assign({}, response);
        let additionalFields: any = {};
        additionalFields.author = {id: questionPostResponse.userId};
        delete questionPostResponse.userId;

        if('surveyId' in questionPostResponse) {
            additionalFields.survey = {id: questionPostResponse.surveyId};
            delete questionPostResponse.surveyId;
        }

        return Object.assign(additionalFields, questionPostResponse);
    }

    private prepareQuestionForApi(question: Question) {
        let postQuestion: any = Object.assign({userId: question.author.id}, question);
        delete postQuestion.author;

        if('survey' in postQuestion) {
            postQuestion.surveyId = postQuestion.survey.id;
            delete postQuestion.survey;
        }

        return postQuestion;
    }

    private validateQuestion(question: Question): boolean {
        if(question.text == '') {
            throw new Error('Tekst pitanja mora biti zadat.');
        }

        if(question.author == null) {
            throw new Error('Autor pitanja mora biti postavljen.');
        }

        switch (question.type) {

            case questionTypes.numeric:
            case questionTypes.text:
                if(question.answerLabels.length == 0) {
                    throw new Error('Tekst bar jednog polja za odgovor mora biti postavljen.');
                }
                break;

            case questionTypes.choose_one:
            case questionTypes.choose_multiple:
                if(question.answerLabels.length < 2) {
                    throw new Error('Pitanje mora imati više ponuđenih odgovora.');
                }
                break;
        }

        return true;
    }

    updateSurveyId(questionId: number, surveyId: number): Observable<Question> {
        return this.api
            .patch('questions/'+questionId, {surveyId: surveyId})
            .map(this.createQuestionFromApiResponse)
            .catch((error: any) => {
                let errorMessage: string = error.message;
                if(error.hasOwnProperty('status') && error.status === 404) {
                    errorMessage = 'Traženo pitanje ne postoji.'
                }
                if(errorMessage.startsWith('Error: ')) {
                    errorMessage = errorMessage.substring(8);
                }
                return Observable.throw(new Error(errorMessage));
            });
    }

    deleteQuestion(questionId: number): Observable<boolean> {
        return this.api
            .delete('questions/'+questionId)
            .map(_ => true)
            .catch(error => Observable.of(false));
    }

    getSurveyQuestions(surveyId: number): Observable<Question[]> {
        return this.api.get('questions?surveyId='+surveyId).map((res: any) => {
            return res
                .map(this.createQuestionFromApiResponse);
        });
    }
}
