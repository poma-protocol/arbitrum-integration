export class MyError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "MyError";
    }
}

export enum Errors {
    SERVER_SETUP="Did Not Set Up Server Well",
}