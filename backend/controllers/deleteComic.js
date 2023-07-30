const Comic = require('../models/comicModel');

exports.deleteComic = (req, res) => {
    const comicObject = req.body;
    const id = comicObject._id;
    Comic.findOne({ _id: id})
        .then(comic => {
            Comic.deleteOne({ _id: id })
            .then(() => {
                const message = `Le comic a bien été supprimé`;
                res.status(200).json({ message });
            })
            .catch(error => res.status(400).json({ error }));
        })
        .catch(error => {
            //const message = 'Le comic n\'a pas pu être récupéré :-( Réessayez dans quelques instants.'
            res.status(500).json(error.message);
        });        
}