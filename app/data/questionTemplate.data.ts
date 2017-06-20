import {questionTypes} from "./question.data";
import {User} from "./user.data";

export interface QuestionTemplate {
    id?: number,
    type: questionTypes,
    text: string,
    required: boolean,
    answerLabels?: string[],
    otherAnswer?: string,
    author: User | {id: number},
}
