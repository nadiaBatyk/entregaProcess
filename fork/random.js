const { fork } = require("child_process");

//funcion random
let randomGen = (cantidad) => {
  let obj = {};
  for (let index = 1; index <= cantidad; index++) {
    let num = Math.floor(Math.random() * 1000 + 1);
    obj[num] = obj[num] + 1 || 1;
  }

  return obj;
};
process.on("message", (cantidad) => {
  process.send(randomGen(cantidad.cantidad));
  process.exit();
});
