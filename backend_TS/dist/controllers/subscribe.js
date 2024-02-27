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
const userModel_1 = __importDefault(require("../models/userModel"));
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function createUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const importedToken = process.env.TOKEN_SECRET || '';
        const utilisateur = req.body;
        const createCallback = (hash) => __awaiter(this, void 0, void 0, function* () {
            utilisateur.password = hash;
            const profil = Object.assign({}, utilisateur);
            try {
                const userCreated = yield userModel_1.default.create(profil);
                if (userCreated) {
                    const message = `Votre profil est créé, ${profil.email}. Bienvenue !`;
                    const token = jsonwebtoken_1.default.sign({ userId: userCreated.id }, importedToken, { expiresIn: '4h' });
                    return res.json({ message, data: userCreated, token });
                }
            }
            catch (error) {
                const message = 'L\'utilisateur n\'a pas pu être créé, réésayez dans un instant...';
                return res.status(500).json({ message, data: error });
            }
        });
        try {
            const hashPassword = yield (0, bcrypt_1.hash)(utilisateur.password, 10);
            if (hashPassword) {
                createCallback(hashPassword);
            }
        }
        catch (error) {
            const message = 'L\'utilisateur n\'a pas pu être créé, réésayez dans un instant...';
            return res.status(500).json({ message, data: error });
        }
    });
}
exports.default = createUser;
/* export default function createUser(req:Request,res:Response) {

    const importedToken = process.env.TOKEN_SECRET || '';

    const utilisateur = req.body;
    hash(utilisateur.password, 10, (err, hash) => {
        utilisateur.password = hash;
        const profil = {...utilisateur};
        UserModel.create(profil)
            .then(user => {
                const message = `Votre profil est créé, ${profil.email}. Bienvenue !`
                res.json({
                    message, data: user, token: jwt.sign(
                        { userId: user.id },
                        importedToken,
                        { expiresIn: '4h' }
                    )
                })
            })
            .catch(error => {
                let message = 'L\'utilisateur n\'a pas pu être créé, réésayez dans un instant...'
                res.status(500).json({ message, data: error })
            })
    })
} */ 
