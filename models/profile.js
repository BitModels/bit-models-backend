const mongoose = require('mongoose')

const ProfileSchema = new mongoose.Schema({
  name: String,
  description: String,
  image: String,
  about: String,
  projects: String,
  location: String,
  education: String,
  areas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Area' }],
  socialNetwork: String,
  active: Boolean,
  registrationDate: Date
});

module.exports = mongoose.model("Profile", ProfileSchema);