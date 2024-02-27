import { Request, Response } from 'express';
import UserModel from '../models/userModel';
import {hash} from 'bcrypt';
import jwt from 'jsonwebtoken';

export default async function createUser(req:Request,res:Response) {

    const importedToken = process.env.TOKEN_SECRET || '';

    const utilisateur = req.body;

    const createCallback = async (hash:string) => {
        utilisateur.password = hash;
        const profil = {...utilisateur};
        try {
            const userCreated = await UserModel.create(profil);
            if (userCreated) {
                const message = `Votre profil est créé, ${profil.email}. Bienvenue !`;
                const token = jwt.sign(
                    { userId: userCreated.id },
                    importedToken,
                    { expiresIn: '4h' }
                )
                return res.json({message, data: userCreated, token});
            }
        } catch (error) {
            const message = 'L\'utilisateur n\'a pas pu être créé, réésayez dans un instant...';
            return res.status(500).json({ message, data: error });
        }
    }

    try {
        const hashPassword = await hash(utilisateur.password, 10);
        if (hashPassword) {
            createCallback(hashPassword);
        }
    } catch (error) {
        const message = 'L\'utilisateur n\'a pas pu être créé, réésayez dans un instant...';
        return res.status(500).json({ message, data: error });
    }
}

/* export default function createUser(req:Request,res:Response) {

    const importedToken = process.env.TOKEN_SECRET || '';

    const utilisateur = req.body;
    hash(utilisateur.password, 10, (err, hash) => {
        utilisateur.password = hash;
        const profil = {...utilisateur};
        UserModel.create(profil)
            .then(user => {
                const message = `Votre profil est créé, ${profil.email}. Bienvenue !`
                res.json({
                    message, data: user, token: jwt.sign(
                        { userId: user.id },
                        importedToken,
                        { expiresIn: '4h' }
                    )
                })
            })
            .catch(error => {
                let message = 'L\'utilisateur n\'a pas pu être créé, réésayez dans un instant...'
                res.status(500).json({ message, data: error })
            })
    })
} */