import {User, userTypes} from '../data/user.data';
import {UserService} from "../services/user/user.service";

function createUserFromResponse(userResponse) {
    let userObject = Object.assign({}, userResponse);
    userObject.birthday = new Date(userResponse.birthday);
    return userObject;
}

let leonardoUserResponse: any = {
    name: "Leonardo",
    surname: "da Vinci",
    type: userTypes.administrator,
    username: "Leo",
    password: "turtlePower",
    birthday: "1452-04-15T16:00:00.000Z",
    phone: "161803398",
    email: "gmail@leo.com",
    id: 1
};
let leonardoUserObject: User = createUserFromResponse(leonardoUserResponse);

let fibonacciUserResponse: any = {
    name: "Leonardo",
    surname: "Bonacci",
    type: userTypes.administrator,
    username: "Fibonacci",
    password: "a84cu5",
    birthday: "1173-03-25T00:00:00.000Z",
    phone: "113591525",
    email: "yahoo@fibonacci.com",
    id: 2
};
let fibonacciUserObject: User = createUserFromResponse(fibonacciUserResponse);

let formAdditionalFields: {passwordConfirm: string, day: any, month: any, year: any} = {
    passwordConfirm: fibonacciUserObject.password,
    day: fibonacciUserObject.birthday.getDate(),
    month: fibonacciUserObject.birthday.getMonth(),
    year: fibonacciUserObject.birthday.getFullYear()
};
let formInputUser = Object.assign(formAdditionalFields, fibonacciUserObject);
delete formInputUser.id;

export {leonardoUserObject}
export {leonardoUserResponse}

export {fibonacciUserObject}
export {fibonacciUserResponse}

export {formInputUser}

let participantUserObject: User = {
    name: "partName",
    surname: "partSurname",
    type: userTypes.participant,
    username: "partUsername",
    password: "partPass",
    birthday: new Date(2002,2,2),
    phone: "54321",
    email: "participant@gmail.com",
    id: 3
};

let clerkUserObject: User = {
    name: "clerkName",
    surname: "clerkSurname",
    type: userTypes.clerk,
    username: "clerkUsername",
    password: "clerkPass",
    birthday: new Date(1991,1,9),
    phone: "32154",
    email: "clerk@gmail.com",
    id: 4
};

let authorUserObject: User = {
    name: "authorName",
    surname: "authorSurname",
    type: userTypes.author,
    username: "authorUsername",
    password: "authorPass",
    birthday: new Date(1999,9,1),
    phone: "09876",
    email: "author@gmail.com",
    id: 5
};

export {participantUserObject}
export {clerkUserObject}
export {authorUserObject}