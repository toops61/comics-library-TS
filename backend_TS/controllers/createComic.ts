import { Request, Response } from 'express';
import ComicModel, { comicSchemaType } from '../models/comicModel';

export default async function createComic(req:Request,res:Response) {
    const comicReq = req.body;
    comicReq._id && delete comicReq._id;

    const createComicFunc = (comic:comicSchemaType) => {
        const message = `Le comic est créé`;
        return res.json({
            message,
            data: comic
        })
    }

    const errorMessage = 'Le comic n\'a pas pu être créé, réessayez dans un instant...';

    try {
        const newComic = await ComicModel.create({...comicReq});

        if (newComic) {
            createComicFunc(newComic);
        } else {
            return res.status(500).json({ errorMessage });
        }
    } catch (error) {
        return res.status(500).json({ errorMessage });
    }
}

/* export default function createComic(req:Request,res:Response) {
    const comic = req.body;
    delete comic._id;
    ComicModel.create({...comic})
        .then(comic => {
            const message = `Le comic est créé`;
            res.json({
                message,
                data: comic
            })
        })
        .catch(error => {
            const message = 'Le comic n\'a pas pu être créé, réessayez dans un instant...'
            res.status(500).json({ message })
        })
} */
