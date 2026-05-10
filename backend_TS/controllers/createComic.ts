import { Request, Response } from 'express';
import ComicModel, { comicSchemaType } from '../models/comicModel.js';

export default async function createComic(req:Request,res:Response) {
    const comicReq = req.body;
    comicReq._id && delete comicReq._id;

    const createComicFunc = (comic:comicSchemaType) => {
        const message = `Le comic est créé`;
        return res.json({
            success:true,
            message,
            data: comic
        })
    }

    const errorMessage = 'Le comic n\'a pas pu être créé, réessayez dans un instant...';

    try {
        const newComic = await ComicModel.create({...comicReq});

        if (!newComic) {
            return res.status(400).json({
                success: false,
                message: "Erreur lors de la création en base"
            });
        }

        if (newComic) {
            createComicFunc(newComic);
        }
        
    } catch (error) {
        return res.status(400).json({
        success: false,
        message: errorMessage
        });
    }
}