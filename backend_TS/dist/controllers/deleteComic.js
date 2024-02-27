"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const comicModel_1 = __importDefault(require("../models/comicModel"));
function deleteComic(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const comicObject = req.body;
        const id = comicObject._id;
        const deleteFunc = () => __awaiter(this, void 0, void 0, function* () {
            try {
                yield comicModel_1.default.deleteOne({ _id: id });
                const message = `Le comic a bien été supprimé`;
                return res.status(200).json({ message });
            }
            catch (error) {
                return res.status(400).json('Erreur dans la suppression, réessayez');
            }
        });
        try {
            const comicFound = yield comicModel_1.default.findOne({ _id: id });
            if (comicFound) {
                deleteFunc();
            }
            else {
                return res.status(500).json('Le comic n\'a pas été retrouvé');
            }
        }
        catch (error) {
            const message = error instanceof Error ? error.message : '';
            return res.status(500).json(message);
        }
    });
}
exports.default = deleteComic;
/* export default function deleteComic(req:Request,res:Response) {
    const comicObject = req.body;
    const id = comicObject._id;
    ComicModel.findOne({ _id: id})
        .then(comic => {
            ComicModel.deleteOne({ _id: id })
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
} */ 
