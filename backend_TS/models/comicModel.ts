import {ObjectId, Schema,model} from 'mongoose';

export interface comicSchemaType {
  album: string;
  serie: string;
  sub_category?: string|null;
  year?: string|null;
  coverURL?: string|null;
  bedetheque?: string|null;
}

const comicSchema = new Schema({
  album: { type: String, required: true },
  serie: { type: String, required: true },
  sub_category: { type: String, required: false },
  year: { type: String, required: false },
  coverURL: { type: String, required: false },
  bedetheque: { type: String, required: false }
});

const ComicModel = model('Comic', comicSchema);

export default ComicModel;