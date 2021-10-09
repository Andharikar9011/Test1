const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

const Admin = require('../models/admin')
const{errorHandler} = require('../helpers/errorHandlers')

exports.sayhi = (req,res,next) => {
    res.json({message : "hello from controller"});
    // res.send('hi');
    // res.send(req)
};

exports.pageredirect = (req,res,next) =>{
    console.log(req.body.value)
    if(req.body.value == 0){
        res.render('signup');
    }
    else{
        if(req.body.value == 1){
            res.render('signin');
        }else{
            res.render('error',{message:"Page Not Found"})
        }
    }
    
}

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
    const admin = new Admin(req.body)
    admin.save((error,admin)=>{

        if(error){
            res.status(400).json({
                 errors : errorHandler(error)
            });
        }else{
            admin.salt= undefined;
            admin.hashed_password = undefined;
            return res.render('signin',{admin:admin});
        }
        
    })
};

exports.signin = (req,res,next)=>{
    //find the admin based on email
    const errors = validationResult(req)
    console.log(errors)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      } 
    const{email,password}=req.body
    Admin.findOne({email},(err,admin)=>{
        if (err || !admin) {
            return res.status(400).json({
                errors:"Admin with that email doesn't exist. Please Signup!!"
            })  
        }
        //if found math password
        if(!admin.authenticate(password)){
            return res.status(401).json({
                errors:"Email and Password dosn't match. Please enter correct Password."
            })
        }
        //generate a signed token with admin details
        const token= jwt.sign({id:admin._id},process.env.JWT_SECRET)
        //persist token as t in cookie with expiry
        res.cookie('t',token,{expire:new Date()+9999})
        const{_id,name,email,role} = admin
        return res.redirect('/admin/dashboard');

    })
};

exports.signout =(req,res,next)=>{

    res.clearCookie("t");
    const data = jwt.verify(req.cookies.t,process.env.JWT_SECRET)
    console.log(data)
    res.redirect('/');
}

exports.requiresignin = expressJwt({
    secret:process.env.JWT_SECRET,
    userProperty:"auth",
    algorithms:["HS256"]
})

exports.isAuthorized = (req,res,next)=>{
    console.log([typeof(req.profile._id),typeof(req.auth)] )
    let admin = req.profile && req.auth && req.auth.id == req.profile._id
    if (!admin) {
        return res.status(403).json({
            errors: " Access Denied !"
        })
    }
    next();
};

exports.isAdmin =(req,res,next)=>{
    if(req.profile.role === 0){
        return res.status(403).json({
            errors: "Super Admin Resourse ! Access Denied !"
        })
    }
    next();
}

exports.auth = (req,res,next)=>{
    console.log('hi')
    console.log(req.cookies.t)
    if (req.cookies.t == undefined){
        res.redirect('/')
    }
    else{
        console.log('token inplace')
    }
    // if (req.cookies.t!= null | req.cookies.t!= undefined){
    //     const data = jwt.verify(req.cookies.t,process.env.JWT_SECRET)
    //     Admin.findOne({_id:data.id},(err,admin)=>{
    //         if (err || !admin) {
    //             return res.render('index')
    //         }
    //         else{
    //             res.json({msg:'Valid user'})
    //         }
    //     })
    // }
    // else{
    //     res.render('index')
    // }
}

exports.dashboard=(req,res,next)=>{
    console.log(req.body,res.cookie)
    res.render('dashboard')
}