import ComicModel from '../models/comicModel.js';
export default async function createComic(req, res) {
    const comicReq = req.body;
    comicReq._id && delete comicReq._id;
    const createComicFunc = (comic) => {
        const message = `Le comic est créé`;
        return res.json({
            success: true,
            message,
            data: comic
        });
    };
    const errorMessage = 'Le comic n\'a pas pu être créé, réessayez dans un instant...';
    try {
        const newComic = await ComicModel.create(Object.assign({}, comicReq));
        if (!newComic) {
            return res.status(400).json({
                success: false,
                message: "Erreur lors de la création en base"
            });
        }
        if (newComic) {
            createComicFunc(newComic);
        }
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: "Erreur, le comic n'a pas pu être créé"
        });
    }
}
