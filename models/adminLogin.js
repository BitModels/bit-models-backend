const mongoose = require('mongoose')

const AdminLoginSchema = new mongoose.Schema({
  login: String,
  password: String
},
{
  timestamps: true
});

module.exports = mongoose.model("AdminLogin", AdminLoginSchema);