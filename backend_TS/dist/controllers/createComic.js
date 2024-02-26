"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const comicModel_1 = __importDefault(require("../models/comicModel"));
function createComic(req, res) {
    const comic = req.body;
    delete comic._id;
    comicModel_1.default.create(Object.assign({}, comic))
        .then(comic => {
        const message = `Le comic est créé`;
        res.json({
            message,
            data: comic
        });
    })
        .catch(error => {
        const message = 'Le comic n\'a pas pu être créé, réessayez dans un instant...';
        res.status(500).json({ message });
    });
}
exports.default = createComic;
