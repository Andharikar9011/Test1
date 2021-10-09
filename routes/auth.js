// libs
const express = require("express");

// exports
const { signin, signup, signout } = require("../controller/admin");

const router = express.Router();

//signup get route for the form
router.get("/signup", (req, res) => {
  res.render("signup");
});

//signup post route for signup
router.post("/signup", signup);

router.get("/login", (req, res) => {
  res.render("signin");
});

router.post("/login", signin);

router.get("/logout", signout);

module.exports = router;
