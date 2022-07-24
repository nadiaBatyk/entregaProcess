const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, require: true, max: 100 },
  password: { type: String, require: true, max: 100 },
});
module.exports = mongoose.model("usuarios", userSchema);
