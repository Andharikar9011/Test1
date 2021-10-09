// libs
const express= require('express');

// exports 
const { sayhi,pageredirect,signin,signup,signout, requiresignin,auth,dashboard } = require('../controller/admin');
const {adminSignupValidator, adminSigninValidator} = require('../validator/validator');

const router = express.Router();

// routes
// router.get('/',requiresignin,sayhi);
router.get('/',sayhi);

router.post('/page',pageredirect);

router.get('/authorize',auth)

router.get('/dashboard',dashboard)

router.get('/signout',signout);

router.post('/signup',adminSignupValidator,signup);

router.post('/signin',adminSigninValidator,signin);

module.exports = router;