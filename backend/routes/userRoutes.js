import {Router} from 'express';
const router = Router();

//const multer = require('../middleware/multer-config');

import createUser from '../controllers/subscribe.js';
import connectUser from '../controllers/login.js';
//const getUser = require('../controllers/userProfil');

router.post('/subscribe', createUser);
router.post('/login', connectUser);

export default router;