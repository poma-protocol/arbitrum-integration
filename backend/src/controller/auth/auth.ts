import { auth } from "../../database/auth";
import { User, UserSchema } from "../../types";
import { MyError } from "../../helpers/errors";
class AuthController {
    async register(args: User) {
        try {
            return await auth.register(args);
        } catch (err) {
            console.error("Error registering user", err);
            if (err instanceof MyError) {
                throw new MyError(err.message);
            }

            throw new Error("Error registering user");
        }
    }

    async login(args: User) {
        try {
            return await auth.login(args);
        } catch (err) {
            if (err instanceof MyError) {
                throw new MyError(err.message);
            }
            throw new Error("Error logging in user");
        }
    }
}
export const authController = new AuthController();