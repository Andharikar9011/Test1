// libs
const express= require('express');

// exports 
const { sayhi,signup,signin,signout } = require('../controller/auth');
const {changepasswordreq,passcodeauth, passswordchange,tempauth} = require('../controller/fp');
const {userSignupValidator, userSigninValidator} = require('../validator/validator');

const router = express.Router();

// routes
// router.get('/',requiresignin,sayhi);
router.get('/',sayhi);
router.post('/signup',userSignupValidator,signup);

router.post('/signin',userSigninValidator ,signin);

router.get('/signout',signout);

router.get('/forgetpassword',changepasswordreq);

router.post('/forgetpasswordauth/:id',tempauth,passcodeauth);

router.post('/passwordchange/:id',tempauth,passswordchange);

module.exports = router;