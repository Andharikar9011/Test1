const jwt = require("jsonwebtoken");
const admin = require("../models/admin");

exports.isLoggedin = async (req, res, next) => {
  try {
    if (req.cookies.t) {
      const { id } = jwt.verify(req.cookies.t, process.env.JWT_SECRET);
      console.log(id);
      const data = await admin.findById(id);
      if (data) {
        next();
      } else {
        res.redirect("/");
      }
    }
  } catch (error) {
    console.log("galat toked de diyee bhai");
    res.redirect("/");
  }
};
