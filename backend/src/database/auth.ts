import { db } from "../db/pool";
import { UserSchema, User } from "../types";
import { gameAdmins } from "../db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
class Auth {
    async register(args: User) {
        try {
            const parsed = UserSchema.safeParse(args);
            if (!parsed.success) {
                throw new Error(parsed.error.issues[0].message);
            }
            const { email, password } = parsed.data;
            const existingUser = await db.select().from(gameAdmins).where(eq(gameAdmins.email, email));
            if (existingUser.length > 0) {
                throw new Error("User already exists");
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            await db.insert(gameAdmins).values({
                email,
                password: hashedPassword
            });
            return { message: "User registered successfully" };
        } catch (err) {
            console.error("Error registering user", err);
            throw new Error("Error registering user");
        }
    }
    async login(args: User) {
        try {
            const parsed = UserSchema.safeParse(args);
            if (!parsed.success) {
                throw new Error(parsed.error.issues[0].message);
            }
            const { email, password } = parsed.data;
            const user = await db.select().from(gameAdmins).where(eq(gameAdmins.email, email));
            
            const isPasswordValid = await bcrypt.compare(password, user[0].password);
            if (!isPasswordValid || user.length === 0) {
                throw new Error("Invalid credentials");
            }
            return { message: "Login successful" };
        }
        catch (err) {
            console.error("Error logging in user", err);
            throw new Error("Error logging in user");
        }
    }
}
export const auth = new Auth();