import {Survey} from "../data/survey.data";
import {leonardoUserObject} from "./users";
import {newNumericQuestion, newTextQuestion, newChooseMultipleQuestion} from "./questions";

let newTestSurvey: Survey = {
    name: 'Test survey',
    start: new Date(2017, 3, 15),
    end: new Date(2017, 3, 30, 23, 59, 59),
    anonymous: false,
    questions: [
        newNumericQuestion,
        newTextQuestion,
        newChooseMultipleQuestion
    ],
    pages: 2,
    author: leonardoUserObject,
    id: 1
};
let newTestSurveyResponse: any = Object.assign({}, newTestSurvey);
newTestSurveyResponse.start = newTestSurveyResponse.start.toJSON();
newTestSurveyResponse.end = newTestSurveyResponse.end.toJSON();
newTestSurveyResponse.author = {id: newTestSurveyResponse.author.id};

let newTestSurveyFormInput: any = Object.assign({}, newTestSurvey);
newTestSurveyFormInput.start = '15.04.2017';
newTestSurveyFormInput.end = '30.04.2017';
delete newTestSurveyFormInput.author;
delete newTestSurveyFormInput.id;

export { newTestSurvey }
export { newTestSurveyResponse }
export { newTestSurveyFormInput }