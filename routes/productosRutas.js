const Router = require("express");
const router = Router();

function isAuth(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.render("layouts\\login", { layout: "login" });
  }
}
//cuando le pegan al endpoint / render index.hbs
router.get("/", isAuth, (req, res) => {
  console.log(req.user);
  res.render("layouts\\index", {
    layout: "index",
    email: req.user.email,
  });
});

module.exports = router;
