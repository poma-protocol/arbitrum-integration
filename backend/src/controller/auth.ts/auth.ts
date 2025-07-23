import { auth } from "../../database/auth";
import { User, UserSchema } from "../../types";
class AuthController {
    async register(args: User) {
        try {
            return await auth.register(args);
        } catch (err) {
            console.error("Error registering user", err);
            throw new Error("Error registering user");
        }
    }

    async login(args: User) {
        try {
            return await auth.login(args);
        } catch (err) {
            console.error("Error logging in user", err);
            throw new Error("Error logging in user");
        }
    }
}
export const authController = new AuthController();