import { Request, Response } from 'express';
import UserModel, { userModelType } from '../models/userModel';
import {compare} from 'bcrypt';
import jwt from 'jsonwebtoken';

export default async function connectUser(req:Request,res:Response) {
    const importedToken = process.env.TOKEN_SECRET || '';

    const responseFunc = async (user:userModelType) => {
        const match = await compare(req.body.password, user.password);
        
        if (match) {
            const token = jwt.sign(
                { userId: user.id },
                importedToken,
                { expiresIn: '4h' }
            )
            const message = `L'utilisateur a été connecté avec succès`;
            return res.json({ message, data: user, token })
        } else {
            return res.status(401).json('Erreur de mot de passe');
        }
    }

    try {
        const queryUser = await UserModel.findOne({ email: req.body.email });
        if (queryUser) {
            responseFunc(queryUser);
        } else {
            return res.status(401).json('L\'utilisateur n\'existe pas, inscrivez-vous svp');
        }
    } catch (error) {
        const message = `L'utilisateur n'a pas pu être connecté.`;
        return res.status(500).json({ message, data: error })
    }
}

/* export default function connectUser(req:Request,res:Response) {
    const importedToken = process.env.TOKEN_SECRET || '';

    UserModel.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json('l\'utilisateur n\'existe pas, inscrivez-vous svp');
            }

            compare(req.body.password, user.password).then(isPasswordValid => {
                if (!isPasswordValid) {
                    return res.status(401).json('erreur de mot de passe')
                }

                const token = jwt.sign(
                    { userId: user.id },
                    importedToken,
                    { expiresIn: '4h' }
                )

                const message = `L'utilisateur a été connecté avec succès`;
                return res.json({ message, data: user, token })

            })
        })
        .catch(error => {
            const message = `L'utilisateur n'a pas pu être connecté.`;
            return res.status(500).json({ message, data: error })
        })
} */