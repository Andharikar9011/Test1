const User = require('../models/user')

exports.userbyID = (req,res,next,id) =>{
    User.findById(id).exec((err,user)=>{
        if (err || !user) {
            res.status(400).json({message:" User not Found"})
        }
        req.profile = user;
        next()
    });
};

exports.returnuser = (req,res)=>{
    res.json({
        user: req.profile
    });
};

