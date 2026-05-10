import { Request, Response } from 'express';
import ComicModel from '../models/comicModel.js';

export default async function deleteComic(req:Request,res:Response) {
    
    try {
        const comicObject = req.body;
        const id = comicObject._id;

        const comicDeleted = await ComicModel.findByIdAndDelete(id);
        
        if (!comicDeleted) {
        return res.status(404).json({
            success: false,
            message: "Comic introuvable"
        });
        }

        return res.status(200).json({
        success: true,
        message: `${comicDeleted.serie} "${comicDeleted.album}" effacé ...`,
        data: id
        });

    } catch (error) {
        return res.status(500).json({
        success: false,
        message: "Erreur, le comic n'a pas pu être effacé"
        });
    }  
}