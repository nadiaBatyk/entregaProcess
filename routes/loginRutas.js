const Router = require("express");
const router = Router();

const passport = require("passport");
//cuando le pegan al endpoint / render index.hbs
router.get("/", (req, res) => {
  res.render("layouts\\login", { layout: "login" });
});
router.get("/registro", (req, res) => {
  res.render("layouts\\registro", { layout: "registro" });
});
router.post(
  "/registro",
  passport.authenticate("registro", {
    failureRedirect: "/errorRegistro",
    successRedirect: "/productos",
  })
);
router.get("/errorRegistro", (req, res) => {
  res.render("layouts\\errorRegistro", { layout: "errorRegistro" });
});

router.post(
  "/login",
  passport.authenticate("login", {
    failureRedirect: "/errorLogin",
    successRedirect: "/productos",
  })
);

router.get("/errorLogin", (req, res) => {
  res.render("layouts\\errorLogin", { layout: "errorLogin" });
});

router.get("/logout", (req, res) => {
  res.render("layouts\\logout", {
    layout: "logout",
    email: req.user.email,
  });
  req.session.destroy();
});

module.exports = router;
