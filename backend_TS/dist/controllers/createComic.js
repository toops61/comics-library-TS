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
function createComic(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const comicReq = req.body;
        comicReq._id && delete comicReq._id;
        const createComicFunc = (comic) => {
            const message = `Le comic est créé`;
            return res.json({
                message,
                data: comic
            });
        };
        const errorMessage = 'Le comic n\'a pas pu être créé, réessayez dans un instant...';
        try {
            const newComic = yield comicModel_1.default.create(Object.assign({}, comicReq));
            if (newComic) {
                createComicFunc(newComic);
            }
            else {
                return res.status(500).json({ errorMessage });
            }
        }
        catch (error) {
            return res.status(500).json({ errorMessage });
        }
    });
}
exports.default = createComic;
/* export default function createComic(req:Request,res:Response) {
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
} */
