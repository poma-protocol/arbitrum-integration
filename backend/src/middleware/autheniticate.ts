import { NextFunction, Request, Response } from "express";
import { Errors } from "../helpers/errors";
import { jwtBearer } from "../helpers/jwt-bearer";

export default async function authenticateMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const payload = await jwtBearer.authenticate(req);
        if (!payload) {
            res.status(401).json({ error: [Errors.UNAUTHORIZED] });
        }

        next();
    } catch (err) {
        console.error("Error authenticating request", err);
        res.status(500).json({ message: Errors.INTERNAL_SERVER_ERROR });
    }
}