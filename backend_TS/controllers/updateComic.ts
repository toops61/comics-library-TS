import { Request, Response } from 'express';
import ComicModel from '../models/comicModel.js';

export default async function updateComic(req:Request,res:Response) {
    const comicObject = req.body;
    const id = comicObject._id;

    try {
        const updatedComic = await ComicModel.findByIdAndUpdate(
            id,
            comicObject,
            { new: true }
        );

        if (!updatedComic) {
            return res.status(404).json({
                success: false,
                message: "Comic introuvable"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Comic modifié !",
            data: updatedComic
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Erreur, le comic n'a pu être modifié"
        });
    }
}