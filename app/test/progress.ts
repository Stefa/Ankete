import {newTestSurvey} from "./surveys";
import {Progress} from "../data/progress.data";
import {leonardoUserObject} from "./users";

let progressObject: Progress = {
    id: 1,
    survey: newTestSurvey,
    user: leonardoUserObject,
    finished: false,
    progress: {done: 0, total: 10}
};

let progressPostResponse = {
    id: 1,
    surveyId: newTestSurvey.id,
    userId: leonardoUserObject.id,
    finished: false,
    progress: {done: 0, total: 10}
};
let progressPostRequest = Object.assign({}, progressPostResponse);
delete progressPostRequest.id;

// with userData
let krangsBirthday = new Date(1987, 11, 15);
let progressObjectByClerk: Progress = Object.assign(
    {userData: {name: 'Krang', birthday: krangsBirthday}},
    progressObject
);
let progressByClerkPostResponse = Object.assign(
    {userData: {name: 'Krang', birthday: krangsBirthday.toJSON()}},
    progressPostResponse
);
let progressByClerkPostRequest = Object.assign(
    {userData: {name: 'Krang', birthday: krangsBirthday}},
    progressPostRequest
);

export {progressObject}
export {progressPostResponse}
export {progressPostRequest}

export {progressObjectByClerk}
export {progressByClerkPostResponse}
export {progressByClerkPostRequest}

