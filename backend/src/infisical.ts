import { InfisicalSDK } from '@infisical/sdk'
import "dotenv/config";

    // Need to use node version below 20
    // const openAIKey = await client.secrets().getSecret({
    //     environment: "prod",
    //     projectId: process.env.PROJECT_ID ?? "",
    //     secretName: "OPEN_API_KEY",
    // });
    // console.log("Open AI key", openAIKey.secretValue);

const client = new InfisicalSDK();
const authClient = client.auth().universalAuth.login({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

export default authClient;