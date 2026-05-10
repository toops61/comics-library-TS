import jwt from "jsonwebtoken";
import { connectToDB } from './connectToDB.js';
const auth = async (req, res, next) => {
    await connectToDB();
    const token = req.cookies.accessToken;
    if (!token) {
        return res.status(401).json({ success: false, message: "reconnexion... plus d'access token" });
    }
    try {
        const { userId } = jwt.verify(token, process.env.TOKEN_SECRET);
        if (!userId)
            return res.status(401).json({ success: false, message: "" });
        next();
    }
    catch (err) {
        const error = err;
        return res.status(401).json({
            success: false,
            message: error.message
        });
    }
};
export default auth;
