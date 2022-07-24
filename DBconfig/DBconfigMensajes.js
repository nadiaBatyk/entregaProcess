require("dotenv").config();
const mongoose = require("mongoose");
const mongo = {
  URL: `mongodb+srv://${process.env.MONGOUSER}:${process.env.MONGOPASS}@cluster0.7ddl8ks.mongodb.net/mensajes?retryWrites=true&w=majority`,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
};
mongoose
  .connect(mongo.URL, mongo.options)
  .then((res) => console.log("conectado a la base de datos"))
  .catch((err) => console.log(err));
