"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const comicModel_1 = __importDefault(require("../models/comicModel"));
function updateComic(req, res) {
    const comicObject = req.body;
    const id = comicObject._id;
    comicModel_1.default.updateOne({ _id: id }, comicObject)
        .then(() => res.status(200).json({
        message: 'Comic modifié !',
        data: comicObject
    }))
        .catch(error => res.status(400).json({ error }));
}
exports.default = updateComic;
