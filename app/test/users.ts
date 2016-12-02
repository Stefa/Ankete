import {User, userTypes} from '../data/User';

function createUserFromResponse(userResponse) {
    let userObject = Object.assign({}, userResponse);
    userObject.birthday = new Date(userResponse.birthday);
    return userObject;
}

let birthdayString1 = "1452-04-15T16:00:00.000Z";
let leonardoUserResponse: any = {
    name: "Leonardo",
    surname: "da Vinci",
    type: userTypes.administrator,
    username: "Leo",
    password: "turtlePower",
    birthday: birthdayString1,
    phone: "161803398",
    email: "gmail@leo.com",
    id: 1
};
let leonardoUserObject: User = createUserFromResponse(leonardoUserResponse);

export {leonardoUserObject}
export {leonardoUserResponse}