export interface User {
    id?: number,
    type: string,
    name: string,
    surname: string,
    username?: string,
    password?: string,
    birthday?: Date,
    phone?: string,
    email: string
}

export const userTypes = {
    participant: 'participant',
    clerk: 'clerk',
    author: 'author',
    administrator: 'administrator',
    external: 'external'
};

export enum UserPermissions {
    anonymous = 0,
    participant,
    clerk,
    author,
    administrator
}
