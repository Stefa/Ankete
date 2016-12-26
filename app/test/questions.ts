import {Question, questionTypes} from "../data/question.data";
import {leonardoUserObject} from "./users";

let questionObject = {
    type: questionTypes.choose_one,
    text: 'How many ninja turtles can you name?',
    answers: ['1', '2', '3', '4']
};

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

let questionApiResponse = Object.assign(
    {
        id: 1,
        author: {id: leonardoUserObject.id}
    },
    questionObject
);

let newNumericQuestion = {
    type: questionTypes.numeric,
    text: 'Continue the sequence: 0, 1, 1, 2, 3, 5, ?',
    answers: ['7th number', '8th number', '9th number'],
    author: leonardoUserObject
};

let newTextQuestion = {
    type: questionTypes.text,
    text: 'Name some turtles:',
    answers: ['First turtle', 'Second turtle', 'Third turtle', 'Forth turtle'],
    author: leonardoUserObject
};

let newChooseMultipleQuestion = {
    type: questionTypes.choose_multiple,
    text: 'What turtles do you like!',
    answers: ['Donatello', 'Leonardo', 'Michelangelo', 'Raphael'],
    author: leonardoUserObject
};

export {newChooseOneQuestion}
export {questionPostRequest}
export {questionPostResponse}
export {questionApiResponse}

export {newNumericQuestion}
export {newTextQuestion}
export {newChooseMultipleQuestion}