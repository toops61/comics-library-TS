import { Request, Response } from 'express';
import ComicModel from '../models/comicModel';

export default function deleteComic(req:Request,res:Response) {
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
}