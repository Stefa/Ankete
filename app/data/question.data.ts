import {User} from "./user.data";
import {Survey} from "./survey.data";

export interface Question {
    id?: number,
    type: questionTypes,
    text: string,
    required: boolean,
    answers?: string[],
    otherAnswer?: string,
    author: User | {id: number},
    survey?: Survey | {id: number}
}

export enum questionTypes {
    numeric = 1,
    text,
    long_text,
    choose_one,
    choose_multiple
}

let questionTypeTitles = new Map(<[number,string][]>[
    [questionTypes.numeric, 'Numerički'],
    [questionTypes.text, 'Tekstualni'],
    [questionTypes.long_text, 'Dugačak tekst'],
    [questionTypes.choose_one, 'Izbor jednog odgovora'],
    [questionTypes.choose_multiple, 'Izbor više odgovora']
]);

export {questionTypeTitles}