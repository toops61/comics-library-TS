import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const auth = (req:Request, res:Response, next:NextFunction) => {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
        const message = `Vous n'avez pas fourni de token. Ajoutez-en un dans l'en-tête de la requête.`
        return res.status(401).json({ message })
    }

    const token = authorizationHeader.split(' ')[1];
    if (!token) {
        const message = `vous devez vous connecter ou reconnecter`;
        return res.status(401).json({message});
    }

    const importedToken = process.env.TOKEN_SECRET || '';
    
    jwt.verify(token, importedToken, (error, decodedToken) => {
        if (error) {
            const message = `Vous n'êtes pas autorisé à accèder à cette ressource.`
            return res.status(401).json({ message, data: error })
        }

        const userId = decodedToken && typeof decodedToken === 'object' ? decodedToken.userId : '';
        if (req.body.userId && req.body.userId !== userId) {
            const message = `Votre identifiant est invalide.`
            res.status(401).json({ message })
        } else {
            next()
        }
    })
}

export default auth;