import { Injectable } from '@angular/core';
import {ApiService} from "../api/api.service";
import {Answer, Answers} from "../../data/answer.data";
import {Observable} from "rxjs/Rx";

@Injectable()
export class AnswerService {

    constructor(public api: ApiService) { }

    createAnswer(answer: Answer): Observable<Answer> {
        let answerPostObject = this.prepareAnswerForApi(answer);

        return this.api
            .post('answers', answerPostObject)
            .map(this.createAnswerFromApiResponse);
    }

    private prepareAnswerForApi(answer: Answer) {
        let answerPostObject: any = Object.assign(
            {progressId: answer.progress.id, questionId: answer.question.id},
            answer
        );

        delete answerPostObject.progress;
        delete answerPostObject.question;

        return answerPostObject;
    }

    private createAnswerFromApiResponse(response: any) {
        let answerPostResponse = Object.assign({}, response);
        let additionalFields: any = {};
        additionalFields.progress = {id: answerPostResponse.progressId};
        delete answerPostResponse.progressId;

        additionalFields.question = {id: answerPostResponse.questionId};
        delete answerPostResponse.questionId;

        return Object.assign(additionalFields, answerPostResponse);
    }

    updateAnswers(answerId: number, answers: Answers): Observable<Answer> {
        let patchAnswer$ = this.api.patch('answers/'+answerId, {answers: answers});
        return this.processAnswerPatchResponse(patchAnswer$);
    }

    setUserAnswer(answerId:number, userAnswer: string): Observable<Answer> {
        let patchAnswer$ = this.api.patch('answers/'+answerId, {userAnswer: userAnswer});
        return this.processAnswerPatchResponse(patchAnswer$);
    }

    private processAnswerPatchResponse(patchRequest$): Observable<Answer> {
        return patchRequest$
            .map(this.createAnswerFromApiResponse)
            .catch((error: any) => {
                let errorMessage: string = error.message;
                if(error.hasOwnProperty('status') && error.status === 404) {
                    errorMessage = 'Traženi odgovor ne postoji.'
                }
                if(errorMessage.startsWith('Error: ')) {
                    errorMessage = errorMessage.substring(8);
                }
                return Observable.throw(new Error(errorMessage));
            });
    }

    deleteAnswer(answerId: number): Observable<boolean> {
        return this.api
            .delete('answers/'+answerId)
            .map(_ => true)
            .catch(error => Observable.of(false));
    }
}