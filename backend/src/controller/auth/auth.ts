import { auth } from "../../database/auth";
import { User, UserSchema } from "../../types";
import { MyError } from "../../helpers/errors";
class AuthController {
    async register(args: User): Promise<string> {
        try {
            const token = await auth.register(args);
            if(token !== null) {
                throw new MyError("Error registering user");
            }
            return token;
        } catch (err) {
            console.error("Error registering user", err);
            if (err instanceof MyError) {
                throw new MyError(err.message);
            }

            throw new Error("Error registering user");
        }
    }

    async login(args: User): Promise<string> {
        try {
            const token = await auth.login(args);
            if(token !== null) {
                throw new MyError("Error logging in user");
            }
            return token;
        } catch (err) {
            if (err instanceof MyError) {
                throw new MyError(err.message);
            }
            throw new Error("Error logging in user");
        }
    }
}
export const authController = new AuthController();