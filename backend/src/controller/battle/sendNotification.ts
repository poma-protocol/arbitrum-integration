import { Errors, MyError } from "../../helpers/errors";
import "dotenv/config";

export interface SendNotification {
    worx_id: string,
    milestone_id: number,
    reward: number | null
}

const API_ENDPOINT = "https://zendocash.com/version-test/api/1.1/obj/UserBattles";

export default async function sendWorxNotification(args: SendNotification): Promise<string> {
    if (!process.env.WORX_TOKEN) {
        console.log("Set Worx token in env variables");
        throw new MyError(Errors.SERVER_SETUP);
    }

    try {
        console.log("Send worx notification called with", args);
        const response = await fetch(API_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.WORX_TOKEN}`
            },
            body: JSON.stringify({
                "UserId": args.worx_id,
                "BattleId": args.milestone_id,
                "Reward": args.reward
            })
        });

        if (response.status == 201) {
            const json = await response.json();
            if (!json['id']) {
                console.log("Worx did not send id", json);
                throw new MyError(Errors.NOT_SEND_WORX_NOTIFICATION);
            }
            return json['id'] as string;
        } else {
            console.log("Invalid response", response);
            throw new MyError(Errors.NOT_SEND_WORX_NOTIFICATION);
        }
    } catch(err) {
        console.log("Error sending Worx update", err);
        throw new MyError(Errors.NOT_SEND_WORX_NOTIFICATION);
    }
}