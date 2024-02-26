import {Router} from 'express';
const router = Router();

import auth from '../auth/auth';

import createComic from '../controllers/createComic';
import updateComic from '../controllers/updateComic';
import deleteComic from '../controllers/deleteComic';

router.post('/newcomic', auth, createComic);
router.put('/updatecomic', auth, updateComic);
router.delete('/deletecomic', auth, deleteComic);

export default router;