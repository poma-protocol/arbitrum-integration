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
    PLAYER_ADDRESS="Player Address Must Be a string",
    NOT_GET_ACTIVITIES="Could Not Get Activities",
    REWARD="Reward Must Be Greater Than Zero",
    NOT_CREATE_ACTIVITY="Could Not Create Activity",
    NOT_ADD_PARTICIPANT="Could Not Add Participant",
    NOT_UPDATE_POINTS="Could Not Update Points",
    CHALLENGE_NAME="Challenge Name Must Be a string",
    ACTIVITY_NAME="Activity name must be a string",
    GAME_CATEGORY="Game category must be a string",
    IMAGE="Image must be uploaded first",
    IMAGE_UPLOAD_FAILED="Image Upload Failed",
    ACTIVITY_START_DATE="Activity start date is invalid",
    ACTIVITY_END_DATE="Activity end date is invalid",
    LMDB_STORE="Could Not Store In LMDB",
    LMDB_READ="Could Not Read From LMDB",
    ACTIVITY_NOT_FOUND = "Activity Not Found",
    INVALID_ACTIVITY_ID = "Invalid Activity ID"
}
