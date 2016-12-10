import {User, userTypes} from '../data/user.data';

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
    birthday: "1173-03-25T21:00:00.000Z",
    phone: "113591525",
    email: "yahoo@fibonacci.com",
    id: 2
};
let fibonacciUserObject: User = createUserFromResponse(fibonacciUserResponse);

export {leonardoUserObject}
export {leonardoUserResponse}
export {fibonacciUserObject}
export {fibonacciUserResponse}