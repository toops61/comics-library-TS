import UserModel from '../models/userModel.js';
import { compare } from 'bcrypt';
import { connectToDB } from '../auth/connectToDB.js';
import { addSession, checksSessionToken } from './sessionServerActions.js';
import { SessionModel } from '../models/sessionModel.js';
export default async function connectUser(req, res) {
    try {
        const { login, password } = req.body;
        if (!login || !password) {
            return res.status(400).json({ success: false });
        }
        await connectToDB();
        const userFound = await UserModel.findOne({ login });
        if (!userFound) {
            return res.json({ success: false, message: "Utilisateur inexistant, créez un compte" });
        }
        const isLogged = await compare(password, userFound.password);
        if (!isLogged) {
            return res.json({ success: false, message: "Erreur de mot de passe" });
        }
        await addSession(String(userFound._id), req, res);
        return res.json({
            success: true,
            message: `Vous êtes connecté, ${login}`,
            data: { login, userId: userFound._id }
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ success: false });
    }
}
export const disconnectUser = async (req, res) => {
    await connectToDB();
    const { sessionId } = await checksSessionToken(req);
    await SessionModel.findByIdAndDelete(sessionId);
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/"
    });
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/"
    });
    return res.json({
        success: true,
        message: `Vous êtes déconnecté`
    });
};
