import { Request, Response } from 'express';
import ComicModel from '../models/comicModel';

export default async function deleteComic(req:Request,res:Response) {
    const comicObject = req.body;
    const id = comicObject._id;

    const deleteFunc = async () => {
        try {
            await ComicModel.deleteOne({ _id: id });
            const message = `Le comic a bien été supprimé`;
            return res.status(200).json({ message });
        } catch (error) {
            return res.status(400).json('Erreur dans la suppression, réessayez');
        }
    }

    try {
        const comicFound = await ComicModel.findOne({ _id: id});
        if (comicFound) {
            deleteFunc();
        } else {
            return res.status(500).json('Le comic n\'a pas été retrouvé');
        }
        
    } catch (error) {
        const message = error instanceof Error ? error.message : '';
        return res.status(500).json(message);
    }

          
}

/* export default function deleteComic(req:Request,res:Response) {
    const comicObject = req.body;
    const id = comicObject._id;
    ComicModel.findOne({ _id: id})
        .then(comic => {
            ComicModel.deleteOne({ _id: id })
            .then(() => {
                const message = `Le comic a bien été supprimé`;
                res.status(200).json({ message });
            })
            .catch(error => res.status(400).json({ error }));
        })
        .catch(error => {
            //const message = 'Le comic n\'a pas pu être récupéré :-( Réessayez dans quelques instants.'
            res.status(500).json(error.message);
        });        
} */