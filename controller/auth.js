const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

const User = require('../models/user')
const{errorHandler} = require('../helpers/errorHandlers')

exports.sayhi = (req,res,next) => {
    res.json({message : "hello from controller"});
    // res.send('hi');
    // res.send(req)
};

exports.signup = (req,res,next) => {
    const errors = validationResult(req)
    console.log(errors)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      } 


    console.log(req.body)
    req.body.mobile= parseInt(req.body.mobile)
    // console.log(req.body)
    req.body.pincode= parseInt(req.body.pincode)
    const user = new User(req.body)
    user.save((error,user)=>{

        if(error){
            res.status(400).json({
                 errors : errorHandler(error)
            });
        }else{
            user.salt= undefined;
            user.hashed_password = undefined;
            res.json({
                user
            });
        }
        
    })
};

exports.signin = (req,res,next)=>{
    //find the user based on email
    const errors = validationResult(req)
    console.log(errors)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      } 
    const{email,password}=req.body
    User.findOne({email},(err,user)=>{
        if (err || !user) {
            return res.status(400).json({
                errors:"User with that email doesn't exist. Please Signup!!"
            })  
        }
        //if found math password
        if(!user.authenticate(password)){
            return res.status(401).json({
                errors:"Email and Password dosn't match. Please enter correct Password."
            })
        }
        //generate a signed token with user details
        const token= jwt.sign({id:user._id},process.env.JWT_SECRET)
        //persist token as t in cookie with expiry
        res.cookie('t',token,{expire:new Date()+9999})
        const{_id,name,email,role} = user
        return res.json({token,user:{_id,email,name,role}});

    })
};

exports.signout =(req,res,next)=>{
    res.clearCookie("t");
    res.json({message:"Sign Out Success"});
}

exports.requiresignin = expressJwt({
    secret:process.env.JWT_SECRET,
    userProperty:"auth",
    algorithms:["HS256"]
})

exports.isAuthorized = (req,res,next)=>{
    console.log([typeof(req.profile._id),typeof(req.auth)] )
    let user = req.profile && req.auth && req.auth.id == req.profile._id
    if (!user) {
        return res.status(403).json({
            errors: " Access Denied !"
        })
    }
    next();
};

exports.isAdmin =(req,res,next)=>{
    if(req.profile.role === 0){
        return res.status(403).json({
            errors: "Admin Resourse ! Access Denied !"
        })
    }
    next();
}

