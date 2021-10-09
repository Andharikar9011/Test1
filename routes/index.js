var express = require("express");
const authValidatior = require("../validator/authValidatior");

const { dashboard } = require("../controller/admin");

var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express", authname: "Aniket" });
});

router.get("/dashboard", authValidatior.isLoggedin, dashboard);

module.exports = router;
