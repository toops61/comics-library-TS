const express = require('express');
const router = express.Router();

const auth = require('../auth/auth');
//const multer = require('../middleware/multer-config');

const createUser = require('../controllers/subscribe');
const connectUser = require('../controllers/login');
//const getUser = require('../controllers/userProfil');

router.post('/subscribe', createUser.createUser);
router.post('/login', connectUser.connectUser);

module.exports = router;