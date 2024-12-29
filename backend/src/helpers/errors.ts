export class MyError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "MyError";
    }
}

export enum Errors {
    SERVER_SETUP="Did Not Set Up Server Well",
    ROUTE_NOT_FOUND="Route Not Found",
    INTERNAL_SERVER_ERROR="Internal Server Error",
    CONTRACT_ADDRESS="Contract Address Must Be A String",
    PLAYER_ADDRESS_VARIABLE="Player Address Variable Must Be a string",
    FUNCTION_NAME="Function Name Must Be a string",
    GAME_NAME="Game Name Must Be a string",
    CHALLENGE_ID="Challenge ID Must Be a number",
    ACTIVITY_GOAL="Activity Goal Must Be A Number",
    ACTIVITY_ID="Activity ID Must Be a number",
    PLAYER_ADDRESS="Player Address Must Be a string"
}