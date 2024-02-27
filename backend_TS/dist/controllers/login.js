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
function connectUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const importedToken = process.env.TOKEN_SECRET || '';
        const responseFunc = (user) => __awaiter(this, void 0, void 0, function* () {
            const match = yield (0, bcrypt_1.compare)(req.body.password, user.password);
            if (match) {
                const token = jsonwebtoken_1.default.sign({ userId: user.id }, importedToken, { expiresIn: '4h' });
                const message = `L'utilisateur a été connecté avec succès`;
                return res.json({ message, data: user, token });
            }
            else {
                return res.status(401).json('Erreur de mot de passe');
            }
        });
        try {
            const queryUser = yield userModel_1.default.findOne({ email: req.body.email });
            if (queryUser) {
                responseFunc(queryUser);
            }
            else {
                return res.status(401).json('L\'utilisateur n\'existe pas, inscrivez-vous svp');
            }
        }
        catch (error) {
            const message = `L'utilisateur n'a pas pu être connecté.`;
            return res.status(500).json({ message, data: error });
        }
    });
}
exports.default = connectUser;
/* export default function connectUser(req:Request,res:Response) {
    const importedToken = process.env.TOKEN_SECRET || '';

    UserModel.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json('l\'utilisateur n\'existe pas, inscrivez-vous svp');
            }

            compare(req.body.password, user.password).then(isPasswordValid => {
                if (!isPasswordValid) {
                    return res.status(401).json('erreur de mot de passe')
                }

                const token = jwt.sign(
                    { userId: user.id },
                    importedToken,
                    { expiresIn: '4h' }
                )

                const message = `L'utilisateur a été connecté avec succès`;
                return res.json({ message, data: user, token })

            })
        })
        .catch(error => {
            const message = `L'utilisateur n'a pas pu être connecté.`;
            return res.status(500).json({ message, data: error })
        })
} */ 
