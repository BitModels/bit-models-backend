const mongoose = require('mongoose')

const AdminLoginSchema = new mongoose.Schema({
  login: String,
  password: String
});

module.exports = mongoose.model("AdminLogin", AdminLoginSchema);