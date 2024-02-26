"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const comicSchema = new mongoose_1.Schema({
    album: { type: String, required: true },
    serie: { type: String, required: true },
    sub_category: { type: String, required: false },
    year: { type: String, required: false },
    coverURL: { type: String, required: false },
    bedetheque: { type: String, required: false }
});
const ComicModel = (0, mongoose_1.model)('Comic', comicSchema);
exports.default = ComicModel;
