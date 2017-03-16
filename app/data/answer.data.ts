import {Progress} from "./progress.data";
import {Question} from "./question.data";

export type Answers = number | Array<number> | string | Array<string>;

export interface Answer {
    id?: number,
    progress: Progress | {id: number},
    question: Question | {id: number},
    answers: Answers,
    userAnswer?: string
}
