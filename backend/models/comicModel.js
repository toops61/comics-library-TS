const mongoose = require('mongoose');

const comicSchema = mongoose.Schema({
  album: { type: String, required: true },
  serie: { type: String, required: true },
  year: { type: String, required: false },
  coverURL: { type: String, required: false },
  bedetheque: { type: String, required: false }
});

module.exports = mongoose.model('Comic', comicSchema);