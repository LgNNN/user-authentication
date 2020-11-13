const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const {valid_fields,redirectAuthed} = require('../middleware/authMiddleware');

router.get('/signup',redirectAuthed, authController.render_signup);
router.get('/login',redirectAuthed, authController.render_login);
router.get('/logout', authController.user_logout);
router.post('/signup', valid_fields(['email','password']), authController.user_signup);
router.post('/login', valid_fields(['email','password','remember']), authController.user_login);


module.exports = router;