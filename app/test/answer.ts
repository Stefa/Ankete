import {Answer} from "../data/answer.data";
import {progressObject} from "./progress";
import {newChooseOneQuestion} from "./questions";

let answerObject: Answer = {
    id: 1,
    progress: progressObject,
    question: newChooseOneQuestion,
    answers: [2]
};

let answerPostResponse = {
    id: 1,
    progressId: progressObject.id,
    questionId: newChooseOneQuestion.id,
    answers: [2]
};

let answerPostRequest = Object.assign({}, answerPostResponse);
delete answerPostRequest.id;

export {answerObject}
export {answerPostResponse}
export {answerPostRequest}

// Answer with userAnswer
let questionWithOtherOption = Object.assign({}, newChooseOneQuestion, {id: 6, otherAnswer: 'Other'});
let answerObjectWithUserAnswer: Answer = {
    id: 2,
    progress: progressObject,
    question: questionWithOtherOption,
    answers: [],
    userAnswer: 'Zach'
};

let answerWithUserAnswerPostResponse = {
    id: 2,
    progressId: progressObject.id,
    questionId: questionWithOtherOption.id,
    answers: [],
    userAnswer: 'Zach'
};
let answerWithUserAnswerPostRequest = Object.assign({}, answerWithUserAnswerPostResponse);
delete answerWithUserAnswerPostRequest.id;

export {answerObjectWithUserAnswer}
export {answerWithUserAnswerPostResponse}
export {answerWithUserAnswerPostRequest}