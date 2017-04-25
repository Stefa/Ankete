import { Injectable } from '@angular/core';
import {ApiService} from "../api/api.service";
import {Progress} from "../../data/progress.data";
import {Observable} from "rxjs/Rx";
import {userTypes} from "../../data/user.data";
import {AnswerService} from "../answer/answer.service";
import {UserService} from "../user/user.service";

@Injectable()
export class ProgressService {

    constructor(private api: ApiService, private answerService: AnswerService) { }

    createProgress(progress: Progress): Observable<Progress> {
        let progressPostObject = this.prepareProgressForApi(progress);

        return this.api
            .post('progress', progressPostObject)
            .map(this.createProgressFromApiResponse);
    }

    private prepareProgressForApi(progress: Progress) {
        let progressPostObject: any = Object.assign(
            {userId: progress.user.id, surveyId: progress.survey.id},
            progress
        );

        if('userData' in progressPostObject && progressPostObject.user.type == userTypes.participant)
            delete progressPostObject.userData;

        delete progressPostObject.user;
        delete progressPostObject.survey;

        return progressPostObject;
    }

    private createProgressFromApiResponse(response: any) {
        let progressPostResponse = Object.assign({}, response);
        let additionalFields: any = {};
        additionalFields.user = {id: progressPostResponse.userId};
        delete progressPostResponse.userId;

        additionalFields.survey = {id: progressPostResponse.surveyId};
        delete progressPostResponse.surveyId;

        if('userData' in progressPostResponse && progressPostResponse.userData != 'anonymous') {
            progressPostResponse.userData.birthday = new Date(progressPostResponse.userData.birthday);
        }

        return Object.assign(additionalFields, progressPostResponse);
    }

    updateProgress(progressId: number, progress: {done: number, total: number}): Observable<Progress> {
        let patchProgress$ = this.api.patch('progress/'+progressId, {progress: progress});
        return this.processProgressPatchResponse(patchProgress$);
    }

    setFinished(progressId: number): Observable<Progress> {
        let patchProgress$ = this.api.patch('progress/'+progressId, {finished: true});
        return this.processProgressPatchResponse(patchProgress$);
    }

    private processProgressPatchResponse(patchRequest$): Observable<Progress> {
        return patchRequest$
            .map(this.createProgressFromApiResponse)
            .catch((error: any) => {
                let errorMessage: string = error.message;
                if(error.hasOwnProperty('status') && error.status === 404) {
                    errorMessage = 'Traženi progres ne postoji.'
                }
                if(errorMessage.startsWith('Error: ')) {
                    errorMessage = errorMessage.substring(8);
                }
                return Observable.throw(new Error(errorMessage));
            });
    }

    deleteProgress(progressId: number): Observable<boolean> {
        return this.api
            .delete('progress/'+progressId)
            .map(_ => true)
            .catch(error => Observable.of(false));
    }

    getProgressWithAnswersBySurveyAndUser(surveyId: number, userId: number): Observable<any> {
        return this.api.get(`progress?surveyId=${surveyId}&userId=${userId}&_embed=answers`).map((res:any) => {
            let usersProgress = res.filter(progress => !('userData' in progress));
            if(usersProgress.length == 0) return null;

            let progress = this.createProgressFromApiResponse(usersProgress[0]);
            progress.answers = progress.answers.map(this.answerService.createAnswerFromApiResponse);

            return progress;
        }).catch((error: any) => {
            let errorMessage: string = error.message;
            if(error.hasOwnProperty('status') && error.status === 404) {
                errorMessage = 'Traženi odgovori ne postoje.'
            }
            if(errorMessage.startsWith('Error: ')) {
                errorMessage = errorMessage.substring(8);
            }
            return Observable.throw(new Error(errorMessage));
        });
    }

    getProgressWithAnswersById(progressId: number): Observable<any> {
        return this.api.get(`progress/${progressId}?_embed=answers`).map((res:any) => {
            let progress = this.createProgressFromApiResponse(res);
            progress.answers = progress.answers.map(this.answerService.createAnswerFromApiResponse);

            return progress;
        }).catch((error: any) => {
            let errorMessage: string = error.message;
            if(error.hasOwnProperty('status') && error.status === 404) {
                errorMessage = 'Traženi odgovori ne postoje.'
            }
            if(errorMessage.startsWith('Error: ')) {
                errorMessage = errorMessage.substring(8);
            }
            return Observable.throw(new Error(errorMessage));
        });
    }

    getFinishedProgressBySurvey(surveyId: number): Observable<Progress[]> {
        return this.api.get(`progress?surveyId=${surveyId}&finished=true&_expand=user`)
            .map(res => res.map(
                p => {
                    let user = UserService.createUserObjectFromResponse(p.user);
                    let progress = this.createProgressFromApiResponse(p);
                    progress.user = user;
                    return progress;
                }
            ))
    }

}