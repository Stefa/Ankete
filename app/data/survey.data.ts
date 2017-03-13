import {User} from "./user.data";
import {Question} from "./question.data";

export interface Survey {
    id?: number,
    name: string,
    start: Date,
    end: Date,
    anonymous: boolean,
    pages: number,
    author: User | {id: number},
    questions?: Array<number>
}
