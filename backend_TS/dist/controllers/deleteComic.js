"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const comicModel_1 = __importDefault(require("../models/comicModel"));
function deleteComic(req, res) {
    const comicObject = req.body;
    const id = comicObject._id;
    comicModel_1.default.findOne({ _id: id })
        .then(comic => {
        comicModel_1.default.deleteOne({ _id: id })
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
exports.default = deleteComic;
