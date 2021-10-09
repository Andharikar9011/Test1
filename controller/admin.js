const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");

const Admin = require("../models/admin");
const User = require("../models/user");

exports.signup = async (req, res) => {
  try {
    const { email, password, mobile, name } = req.body;
    req.body.mobile = parseInt(mobile);
    const token = "";
    if (req.body.isAdmin) {
      const newAdmin = await new Admin({ email, password, mobile, name });
      const addAdmin = await newAdmin.save();
      token = jwt.sign({ id: addAdmin._id }, process.env.JWT_SECRET);
    } else {
      const newUser = await new User({ email, password, mobile, name });
      const addUser = await newUser.save();
      token = jwt.sign({ id: addUser._id }, process.env.JWT_SECRET);
    }
    res.cookie("t", token);
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error });
  }
};

exports.signin = async (req, res) => {
  const { email, password } = req.body;

  const user = Admin.findOne({ email });
  console.log(user);
  res.send("blu");

  /* , (err, admin) => {
    if (err || !admin) {
      return res.status(400).json({
        errors: "Admin with that email doesn't exist. Please Signup!!",
      });
    } */
  //if found match password
  /* if (!admin.authenticate(password)) {
      return res.status(401).json({
        errors:
          "Email and Password dosn't match. Please enter correct Password.",
      });
    }
    //generate a signed token with admin details
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET);
    //persist token as t in cookie with expiry
    res.cookie("t", token, { expire: new Date() + 9999 });
    const { _id, name, email, role } = admin;
    return res.redirect("/admin/dashboard");
  }); */
};

exports.signout = (req, res, next) => {
  res.clearCookie("t");
  console.log("token gaya");
  res.redirect("/");
};

exports.requiresignin = expressJwt({
  secret: process.env.JWT_SECRET,
  userProperty: "auth",
  algorithms: ["HS256"],
});

exports.isAuthorized = (req, res, next) => {
  console.log([typeof req.profile._id, typeof req.auth]);
  let admin = req.profile && req.auth && req.auth.id == req.profile._id;
  if (!admin) {
    return res.status(403).json({
      errors: " Access Denied !",
    });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json({
      errors: "Super Admin Resourse ! Access Denied !",
    });
  }
  next();
};

exports.auth = (req, res, next) => {
  console.log("hi");
  console.log(req.cookies.t);
  if (req.cookies.t == undefined) {
    res.redirect("/");
  } else {
    console.log("token inplace");
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
};

exports.dashboard = (req, res, next) => {
  console.log(req.body, res.cookie);
  res.render("dashboard");
};
