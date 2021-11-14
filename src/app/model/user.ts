interface BaseUser {
    authenticatedUserId: string;
    name: string;
    phone: string;
}

export class User implements BaseUser {
    authenticatedUserId: string;
    name: string;
    phone: string;
}

export class Person implements BaseUser {
    authenticatedUserId: string;
    name: string;
    phone: string;
    dateOfMeeting: string;
    locationOfMeeting: string;
    personAge: number;

}
