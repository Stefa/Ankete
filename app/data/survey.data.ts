import {User} from "./user.data";
import {Question} from "./question.data";

export interface Survey {
    id?: number,
    name: string,
    start: Date,
    end: Date,
    anonymous: boolean,
    questions: Question[],
    pages: number,
    author: User | {id: string}
}
