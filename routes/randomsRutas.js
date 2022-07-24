const Router = require("express");
const router = Router();
const { fork } = require("child_process");

function isAuth(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.render("layouts\\login", { layout: "login" });
  }
}
//cuando le pegan al endpoint / render index.hbs
router.get("/", isAuth, (req, res) => {
  const logica = fork("./fork/random.js");
  let { cant } = req.query;

  logica.send({ cantidad: +cant || 10000000 });
  logica.on("message", (objeto) => {
   
    res.render("layouts\\randoms", {
      layout: "randoms",
      objeto,
    });
  });
});

module.exports = router;
