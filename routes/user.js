// libs
const express= require('express');
const router = express.Router();

// exports 
const { requiresignin, isAdmin,isAuthorized } = require('../controller/auth');
const { userbyID,returnuser } = require('../controller/user');

// routes
router.param('_id',userbyID);

router.get('/secret/:_id',requiresignin,isAuthorized,returnuser); //isAdmin - middlewere not added

module.exports = router;