const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const crypto = require('crypto');
const User = require('../models/user')
const{errorHandler} = require('../helpers/errorHandlers')
const sm = require('../sendgrid');



exports.changepasswordreq  = (req,res,next)=>{
    console.log(req.query.email)
    email = req.query.email
    User.findOne({email},(err,user)=>{
        if (err || !user) {
            return res.status(400).json({
                errors:"User with that email doesn't exist. Please Signup!! 1"
            })  
        }
        else{
            const code = Math.floor(100000 + Math.random() * 900000)
            User.updateOne({_id:user._id},{$set:{code:code,passchangereq:1}},{strict:0},(err,data)=>{
                if (err || !user) {
                    return res.status(400).json({
                        errors:"User with that email doesn't exist. Please Signup 2!!"
                    })  
                }
                else{
                    // console.log(data)
                    // res.send(data)
                    sm.sendmail(user.email,code,user.name)
                    .then((data)=>{
                        // console.log(data)
                        const token= jwt.sign({id:user.email},process.env.JWT_SECRET,{expiresIn:5*60})
                        res.json({token:token,msg:'Email Sent'})
                    })
                    .catch(err=>{
                        console.log(err)
                        res.status(400).json({errors:'Fail'})
                    })
                }
            })
            // console.log(code)
        }
    })
}

exports.tempauth= expressJwt({
    secret:process.env.JWT_SECRET,
    userProperty:"auth",
    algorithms:["HS256"],
    getToken: function fromHeaderOrQuerystring (req) {
        return req.params.id
      }
})

exports.passcodeauth=(req,res,next)=>{
    const code = req.body.code;
    User.findOne({email:req.auth.id},(err,user)=>{
        if (err || !user) {
            return res.status(400).json({
                errors:"User with that email doesn't exist. Please Signup!!"
            })  
        }
        else{
            console.log(user,user.code)
            console.log(Object.entries(user));
            // *** Hardcoded
            if (Object.entries(user)[5][1].code == code ){
                const token= jwt.sign({id:user.email},process.env.JWT_SECRET,{expiresIn:5*60})
                        res.json({token:token,msg:'Success'})
                // res.send('Sucess')
            }
            // ***
            else{
                res.status(401).json({
                    errors:'Invalid code'
                })
            }
        }
    })
    // res.send('hi')
}
exports.passswordchange=(req,res,next)=>{
    // console.log(req.params,req.body.password)
    User.findOne({email:req.auth.id},(err,user)=>{
        if (err || !user) {
            return res.status(400).json({
                errors:"User with that email doesn't exist."
            })  
        }
        else{
            // console.log(req.body.password)
            // console.log(user,user.salt)
            const password = req.body.password
            const hashed_password = crypto.createHmac('sha1', user.salt).update(password).digest("hex");
            // console.log([hashed_password,password])
            User.updateOne({_id:user._id},{$set:{hashed_password:hashed_password},$unset:{code:""}},{strict:0},(err,user)=>{
                if (err || !user) {
                    return res.status(400).json({
                        errors:"User with that email doesn't exist."
                    })  
                }
                else{
                    res.json({msg:"Password Changed Sucessfully"})
                }
            })
            // res.send('hi')
        }
    })
    
}