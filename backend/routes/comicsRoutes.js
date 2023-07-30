const express = require('express');
const router = express.Router();

const auth = require('../auth/auth');

const createComic = require('../controllers/createComic');
const updateComic = require('../controllers/updateComic');
const deleteComic = require('../controllers/deleteComic');

router.post('/newcomic', auth, createComic.createComic);
router.put('/updatecomic', auth, updateComic.updateComic);
router.delete('/deletecomic', auth, deleteComic.deleteComic);

module.exports = router;