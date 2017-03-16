import {TestBed, inject} from "@angular/core/testing";
import {ProgressService} from "./progress.service";
import {ApiService} from "../api/api.service";
import {MockApiService} from "../api/mock-api.service";
import {
    progressPostResponse, progressObject, progressPostRequest, progressObjectByClerk,
    progressByClerkPostResponse, progressByClerkPostRequest
} from "../../test/progress";
import {Progress} from "../../data/progress.data";
import {leonardoUserObject} from "../../test/users";
import {userTypes} from "../../data/user.data";

describe('ProgressServise', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                ProgressService,
                {provide: ApiService, useClass: MockApiService}
            ]
        });
    });
    
    describe('createProgress', () => {
        it('should send the right progress data to api service post action', inject(
            [ApiService, ProgressService],
            (apiService: MockApiService, progressService: ProgressService) => {
                let newProgressObject = Object.assign({}, progressObject);
                delete newProgressObject.id;

                apiService.setResponse(progressPostResponse);
                apiService.init();
                progressService.createProgress(newProgressObject).subscribe();

                expect(apiService.post).toHaveBeenCalledWith('progress', progressPostRequest);
            }
        ));
        
        it('should return progress object if progress was successfully saved to api', inject(
            [ApiService, ProgressService],
            (apiService: MockApiService, progressService: ProgressService) => {
                let newProgressObject = Object.assign({}, progressObject);
                delete newProgressObject.id;
                let createdProgress: Progress = null;
                let expectedReturnProgress = Object.assign({}, progressObject, {
                    survey: {id: progressObject.survey.id},
                    user: {id: progressObject.user.id},
                });

                apiService.setResponse(progressPostResponse);
                apiService.init();
                progressService.createProgress(newProgressObject).subscribe(
                    progress => createdProgress = progress
                );

                expect(createdProgress).toEqual(expectedReturnProgress);
            }
        ));

        it('should send userData property if populated and user is not of type participant', inject(
            [ApiService, ProgressService],
            (apiService: MockApiService, progressService: ProgressService) => {
                let newProgressObject = Object.assign({}, progressObjectByClerk);
                delete newProgressObject.id;

                apiService.setResponse(progressByClerkPostResponse);
                apiService.init();
                progressService.createProgress(newProgressObject).subscribe();

                expect(apiService.post).toHaveBeenCalledWith('progress', progressByClerkPostRequest);
            }
        ));

        it('should return progress object with userData if progress was successfully saved to api', inject(
            [ApiService, ProgressService],
            (apiService: MockApiService, progressService: ProgressService) => {
                let newProgressObject = Object.assign({}, progressObjectByClerk);
                delete newProgressObject.id;
                let createdProgress: Progress = null;
                let expectedReturnProgress = Object.assign({}, progressObjectByClerk, {
                    survey: {id: progressObject.survey.id},
                    user: {id: progressObject.user.id},
                });

                apiService.setResponse(progressByClerkPostResponse);
                apiService.init();
                progressService.createProgress(newProgressObject).subscribe(
                    progress => createdProgress = progress
                );

                expect(createdProgress).toEqual(expectedReturnProgress);
            }
        ));

        it('should ignore userData property if user is of type participant', inject(
            [ApiService, ProgressService],
            (apiService: MockApiService, progressService: ProgressService) => {
                let newProgressObject = Object.assign({}, progressObjectByClerk);
                delete newProgressObject.id;

                let participantUser = Object.assign({}, leonardoUserObject, {type: userTypes.participant});
                newProgressObject.user = participantUser;

                apiService.setResponse(progressPostResponse);
                apiService.init();
                progressService.createProgress(newProgressObject).subscribe();

                expect(apiService.post).toHaveBeenCalledWith('progress', progressPostRequest);
            }
        ));
    });

    describe('updateProgress', () => {
        it('should send the right update data to api service patch action', inject(
            [ApiService, ProgressService],
            (apiService: MockApiService, progressService: ProgressService) => {
                let updatedProgressPostResponse = Object.assign({}, progressPostResponse, {progress: {done: 1, total: 10}});
                apiService.setResponse(updatedProgressPostResponse);
                apiService.init();
                progressService.updateProgress(1, {done: 1, total: 10}).subscribe();

                expect(apiService.patch).toHaveBeenCalledWith('progress/1', {progress: {done: 1, total: 10}});
            }
        ));

        it('should return progress object with updated progress field', inject(
            [ApiService, ProgressService],
            (apiService: MockApiService, progressService: ProgressService) => {
                let updatedProgressPostResponse = Object.assign({}, progressPostResponse, {progress: {done: 1, total: 10}});
                let updatedProgress: Progress;
                let expectedProgress = Object.assign({}, progressObject, {
                    survey: {id: progressObject.survey.id},
                    user: {id: progressObject.user.id},
                    progress: {done: 1, total: 10}
                });
                apiService.setResponse(updatedProgressPostResponse);
                apiService.init();
                progressService.updateProgress(1, {done: 1, total: 10})
                    .subscribe(progress => updatedProgress = progress);

                expect(updatedProgress).toEqual(expectedProgress);
            }
        ));

        it('should throw appropriate error when progress for update was not found', inject(
            [ApiService, ProgressService],
            (apiService: MockApiService, progressService: ProgressService) => {
                let updatedProgress: Progress;
                let errorMessage: any;

                let errorResponse: any = {
                    status: 404,
                    message: '404 - Not Found'
                };

                apiService.setError(errorResponse);
                apiService.init();

                progressService.updateProgress(1, {done: 1, total: 10}).subscribe(
                    progress => updatedProgress = progress,
                    error => errorMessage = error.message
                );

                expect(updatedProgress).toBeUndefined();
                expect(errorMessage).toBe("Traženi progres ne postoji.")
            }
        ));
    });

    describe('setFinished', () => {
        it('should send the right update data to api service patch action', inject(
            [ApiService, ProgressService],
            (apiService: MockApiService, progressService: ProgressService) => {
                let updatedProgressPostResponse = Object.assign({}, progressPostResponse, {finished: true});
                apiService.setResponse(updatedProgressPostResponse);
                apiService.init();
                progressService.setFinished(1).subscribe();

                expect(apiService.patch).toHaveBeenCalledWith('progress/1', {finished: true});
            }
        ));

        it('should return progress object with updated progress field', inject(
            [ApiService, ProgressService],
            (apiService: MockApiService, progressService: ProgressService) => {
                let updatedProgressPostResponse = Object.assign({}, progressPostResponse, {finished: true});
                let updatedProgress: Progress;
                let expectedProgress = Object.assign({}, progressObject, {
                    survey: {id: progressObject.survey.id},
                    user: {id: progressObject.user.id},
                    finished: true
                });
                apiService.setResponse(updatedProgressPostResponse);
                apiService.init();
                progressService.setFinished(1)
                    .subscribe(progress => updatedProgress = progress);

                expect(updatedProgress).toEqual(expectedProgress);
            }
        ));

        it('should throw appropriate error when progress for update was not found', inject(
            [ApiService, ProgressService],
            (apiService: MockApiService, progressService: ProgressService) => {
                let updatedProgress: Progress;
                let errorMessage: any;

                let errorResponse: any = {
                    status: 404,
                    message: '404 - Not Found'
                };

                apiService.setError(errorResponse);
                apiService.init();

                progressService.setFinished(1).subscribe(
                    progress => updatedProgress = progress,
                    error => errorMessage = error.message
                );

                expect(updatedProgress).toBeUndefined();
                expect(errorMessage).toBe("Traženi progres ne postoji.")
            }
        ));
    });

    describe('deleteProgress', () => {
        it('should send the right progress path to api service', inject(
            [ApiService, ProgressService],
            (apiService: MockApiService, progressService: ProgressService) => {
                apiService.setResponse({});
                apiService.init();
                progressService.deleteProgress(1).subscribe();

                expect(apiService.delete).toHaveBeenCalledWith('progress/1');
            }
        ));

        it('should return true if progress was successfully deleted', inject(
            [ApiService, ProgressService],
            (apiService: MockApiService, progressService: ProgressService) => {
                let success: boolean;

                apiService.setResponse({});
                apiService.init();
                progressService.deleteProgress(1).subscribe(deleted => success = deleted);

                expect(success).toBe(true);
            }
        ));

        it('should return false if progress was not found',  inject(
            [ApiService, ProgressService],
            (apiService: MockApiService, progressService: ProgressService) => {
                let success: boolean;
                let errorResponse: any = {
                    status: 404,
                    message: '404 - Not Found'
                };

                apiService.setError(errorResponse);
                apiService.init();

                progressService.deleteProgress(1).subscribe(deleted => success = deleted);

                expect(success).toBe(false);
            }
        ));
    });
});
