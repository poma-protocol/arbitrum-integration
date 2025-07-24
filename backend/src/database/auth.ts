import { db } from "../db/pool";
import { UserSchema, User } from "../types";
import { gameAdmins } from "../db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { MyError } from "../helpers/errors";
import { jwtBearer } from "../helpers/jwt-bearer";
class Auth {
    async register(args: User): Promise<string> {
        try {
            const parsed = UserSchema.safeParse(args);
            if (!parsed.success) {
                throw new MyError(parsed.error.issues[0].message);
            }
            const { email, password } = parsed.data;
            const existingUser = await db.select().from(gameAdmins).where(eq(gameAdmins.email, email));
            if (existingUser.length > 0) {
                throw new MyError("User already exists");
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const result = await db.insert(gameAdmins).values({
                email,
                password: hashedPassword
            }).returning();
            if (!result || result.length === 0) {
                throw new MyError("Error creating user");
            }
            const token = jwtBearer.encodeJwt({ email, userId: result[0].id });
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
            const parsed = UserSchema.safeParse(args);
            if (!parsed.success) {
                throw new MyError(parsed.error.issues[0].message);
            }
            const { email, password } = parsed.data;
            const user = await db.select().from(gameAdmins).where(eq(gameAdmins.email, email));
            if( user.length === 0) {
                throw new MyError("Invalid credentials");
            }

            const isPasswordValid = await bcrypt.compare(password, user[0].password);
            if (!isPasswordValid) {
                throw new MyError("Invalid credentials");
            }
            const token = jwtBearer.encodeJwt({ email, userId: user[0].id });
            return token;
        } catch (err) {
            console.error("Error logging in user", err);
            if (err instanceof MyError) {
                throw new MyError(err.message);
            }
            throw new Error("Error logging in user");
        }
    }
}
export const auth = new Auth();