import ComicModel from '../models/comicModel.js';

export default function createComic(req, res) {
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
}
