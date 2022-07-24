const Router = require("express");
const router = Router();
const { faker } = require("@faker-js/faker");

//cuando le pegan al endpoint de test / render index.hbs
router.get("/", (req, res) => {
  const arr = [];
  for (let index = 0; index < 5; index++) {
    arr.push({
      nombre: faker.commerce.productName(),
      precio: faker.commerce.price(),
      link:faker.image.food(640, 480, true)
    });
  }
  res.render("layouts\\test", { data:arr, layout: "test" });
  
});

module.exports = router;
