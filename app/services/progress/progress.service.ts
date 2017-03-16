import { Injectable } from '@angular/core';
import {ApiService} from "../api/api.service";
import {Progress} from "../../data/progress.data";
import {Observable} from "rxjs/Rx";
import {userTypes} from "../../data/user.data";

@Injectable()
export class ProgressService {

    constructor(public api: ApiService) { }

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

        if('userData' in progressPostResponse) {
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

}