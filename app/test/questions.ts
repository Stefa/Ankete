import {Question, questionTypes} from "../data/question.data";
import {leonardoUserObject} from "./users";
import {newTestSurvey} from "./surveys";

let questionObject = {
    type: questionTypes.choose_one,
    text: 'How is your favourite turtle?',
    answerLabels: ['Donatello', 'Leonardo', 'Michelangelo', 'Raphael'],
    required: true
};

// question without survey
let newChooseOneQuestion: Question = Object.assign(
    {author: leonardoUserObject},
    questionObject
);

let questionPostRequest = Object.assign(
    {userId: leonardoUserObject.id},
    questionObject
);

let questionPostResponse = Object.assign(
    {
        id: 1,
        userId: leonardoUserObject.id
    },
    questionObject
);

let expectedCreateQuestionResponse = Object.assign(
    {
        id: 1,
        author: {id: leonardoUserObject.id}
    },
    questionObject
);

// question with survey
let newQuestionForSurvey: Question = Object.assign(
    {
        author: leonardoUserObject,
        survey: newTestSurvey,
    },
    questionObject
);

let questionForSurveyPostRequest = Object.assign(
    {
        userId: leonardoUserObject.id,
        surveyId: newTestSurvey.id
    },
    questionObject
);

let questionForSurveyPostResponse = Object.assign(
    {
        id: 1,
        userId: leonardoUserObject.id,
        surveyId: newTestSurvey.id
    },
    questionObject
);
let expectedCreateQuestionForSurveyResponse = Object.assign(
    {
        id: 1,
        author: {id: leonardoUserObject.id},
        survey: {id: newTestSurvey.id}
    },
    questionObject
);

let newNumericQuestion = {
    type: questionTypes.numeric,
    text: 'What is the number of artwork that you can remember by:',
    required: true,
    answerLabels: ['Donatello', 'Leonardo', 'Michelangelo', 'Raphael'],
    author: leonardoUserObject
};

let newTextQuestion = {
    type: questionTypes.text,
    text: 'Name some turtles:',
    required: false,
    answerLabels: ['First turtle', 'Second turtle', 'Third turtle', 'Forth turtle'],
    author: leonardoUserObject
};

let newChooseMultipleQuestion = {
    type: questionTypes.choose_multiple,
    text: 'What turtles do you like!',
    required: false,
    answerLabels: ['Donatello', 'Leonardo', 'Michelangelo', 'Raphael'],
    author: leonardoUserObject
};

export {newChooseOneQuestion}
export {questionPostRequest}
export {questionPostResponse}
export {expectedCreateQuestionResponse}

export {newQuestionForSurvey}
export {questionForSurveyPostRequest}
export {questionForSurveyPostResponse}
export {expectedCreateQuestionForSurveyResponse}

export {newNumericQuestion}
export {newTextQuestion}
export {newChooseMultipleQuestion}