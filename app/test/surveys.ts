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

export { newTestSurvey }
export { newTestSurveyResponse }