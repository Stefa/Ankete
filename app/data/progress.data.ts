import {User} from "./user.data";
import {Survey} from "./survey.data";
import {Answer} from "./answer.data";

export type UserData = {name: string, surname: string, birthday: Date} | "anonymous";

export interface Progress {
    id?: number,
    survey: Survey | {id: number},
    user: User | {id: number},
    userData?: UserData,
    finished: boolean,
    progress: {done: number, total: number},
    answers?: Array<Answer>
}
