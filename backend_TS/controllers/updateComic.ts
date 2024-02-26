import { Request, Response } from 'express';
import ComicModel from '../models/comicModel';

export default function updateComic(req:Request,res:Response) {
    const comicObject = req.body;
    const id = comicObject._id;
    ComicModel.updateOne({ _id: id }, comicObject)
        .then(() => res.status(200).json({
            message: 'Comic modifié !',
            data: comicObject
        }))
        .catch(error => res.status(400).json({ error }));
}