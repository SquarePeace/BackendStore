'use strict'

var express = require('express');
var UserController = require('../controllers/user');

var router = express.Router();

//rutas
router.post('/signup', UserController.signup);
router.post('/signin', UserController.signin);
module.exports = router;