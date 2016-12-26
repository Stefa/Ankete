import {User} from "./user.data";

export interface Question {
    id?: number,
    type: questionTypes,
    text: string,
    answers?: string[],
    author: User | {id: string}
}

export enum questionTypes {
    numeric = 1,
    text,
    long_text,
    choose_one,
    choose_multiple
}