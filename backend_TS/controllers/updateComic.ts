import { Request, Response } from 'express';
import ComicModel from '../models/comicModel';

export default async function updateComic(req:Request,res:Response) {
    const comicObject = req.body;
    const id = comicObject._id;

    try {
        await ComicModel.updateOne({ _id: id }, comicObject);
        return res.status(200).json({
            message: 'Comic modifié !',
            data: comicObject
        })
    } catch (error) {
        const message = error instanceof Error ? error.message : '';
        return res.status(500).json(message);
    }
}