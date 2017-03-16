import {User} from "./user.data";
import {Survey} from "./survey.data";

export interface Progress {
    id?: number,
    survey: Survey | {id: number},
    user: User | {id: number},
    userData?: {name: string, birthday: Date},
    finished: boolean,
    progress: {done: number, total: number}
}
