import { Request, Response, NextFunction } from 'express';
import jwt from "jsonwebtoken";
import { connectToDB } from './connectToDB.js';
import { AuthError, RefreshTokenPayload } from '../interfaces.js';

const auth = async (req: Request, res: Response, next: NextFunction) => {
    await connectToDB();

    const token = req.cookies.accessToken;

    if (!token) {
        return res.status(401).json({ success: false, message: "reconnexion... plus d'access token" });
    }

    try {
        const { userId } = jwt.verify(token,process.env.TOKEN_SECRET as string) as RefreshTokenPayload;
        if (!userId) return res.status(401).json({ success: false, message: "" });
        next();
    } catch (err) {
        const error = err as AuthError;

        return res.status(401).json({
        success: false,
        message: error.message
        });
    }
};

export default auth;