const Comic = require('../models/comicModel');

exports.updateComic = (req, res) => {
    const comicObject = req.body;
    const id = comicObject._id;
    Comic.updateOne({ _id: id }, comicObject)
        .then(() => res.status(200).json({
            message: 'Comic modifié !',
            data: comicObject
        }))
        .catch(error => res.status(400).json({ error }));
}