import {Schema,model} from 'mongoose';

const comicSchema = Schema({
  album: { type: String, required: true },
  serie: { type: String, required: true },
  sub_category: { type: String, required: false },
  year: { type: String, required: false },
  coverURL: { type: String, required: false },
  bedetheque: { type: String, required: false }
});

const ComicModel = model('Comic', comicSchema);

export default ComicModel;