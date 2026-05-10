import ComicModel from '../models/comicModel.js';
export default async function deleteComic(req, res) {
    try {
        const comicObject = req.body;
        const id = comicObject._id;
        const comicDeleted = await ComicModel.findByIdAndDelete(id);
        console.log('disc wanted Deleted :', comicDeleted);
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
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Erreur, le disque n'a pas pu être effacé"
        });
    }
}
