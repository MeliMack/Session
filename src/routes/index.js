const path = require('path');
const express = require('express');
const router = express.Router();
const multer = require('multer');
const userController = require('../controllers/userController');
const registerMiddleware = require('../middlewares/registerMiddleware');
const registerValidation = require('../validations/registerValidation');
const loginValidation = require('../validations/loginValidation');
const verifyUserMiddleware = require('../middlewares/verifyUserMiddleware');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '../../public/uploads/avatars'))
    },
    filename: function (req, file, cb) {
        cb(null, req.body.email + '-' + Date.now() + path.extname(file.originalname))
    }
})
   
var upload = multer({ storage: storage })

// Rutas públicas
router.get('/', userController.index);
router.get('/register', userController.register);
router.post('/register', upload.any(), registerValidation, registerMiddleware, userController.save);
router.get('/login', userController.login);
router.post('/login', loginValidation, userController.verify);

// Rutas para usuarios logueados
router.get('/welcome', verifyUserMiddleware, userController.welcome);
router.get('/logout', verifyUserMiddleware, userController.logout);

router.get('/cookie', function(req, res) {
    res.send(req.cookies);
})

module.exports = router;