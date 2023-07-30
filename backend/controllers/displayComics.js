const Comic = require('../models/comicModel')

exports.displayComics = (req, res) => {

    Comic.find()
        .then(comics => res.status(200).json(comics))
        .catch(error => {
            const message = `Les comics n'ont pas été chargés.`;
            return res.status(401).json({ message, data: error })
        })
}