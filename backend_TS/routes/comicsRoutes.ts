import {Router} from 'express';
const router = Router();

import auth from '../auth/auth.js';

import createComic from '../controllers/createComic.js';
import updateComic from '../controllers/updateComic.js';
import deleteComic from '../controllers/deleteComic.js';

router.post('/newcomic', auth, createComic);
router.put('/updatecomic', auth, updateComic);
router.delete('/deletecomic', auth, deleteComic);

export default router;