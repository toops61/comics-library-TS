"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const auth_1 = __importDefault(require("../auth/auth"));
const createComic_1 = __importDefault(require("../controllers/createComic"));
const updateComic_1 = __importDefault(require("../controllers/updateComic"));
const deleteComic_1 = __importDefault(require("../controllers/deleteComic"));
router.post('/newcomic', auth_1.default, createComic_1.default);
router.put('/updatecomic', auth_1.default, updateComic_1.default);
router.delete('/deletecomic', auth_1.default, deleteComic_1.default);
exports.default = router;
