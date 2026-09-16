import { Schema, model } from 'mongoose';
const comicSchema = new Schema({
    album: { type: String, required: true },
    linked_album: { type: String, required: false },
    serie: { type: String, required: true },
    sub_category: { type: String, required: false },
    number: { type: String, required: false },
    year: { type: String, required: false },
    coverURL: { type: String, required: false },
    bedetheque: { type: String, required: false }
});
const ComicModel = model('Comic', comicSchema);
export default ComicModel;
