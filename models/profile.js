const mongoose = require('mongoose')

const ProfileSchema = new mongoose.Schema({
  name: String,
  description: String,
  image: String,
  about: String,
  work: String,
  location: String,
  education: String,
  areas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Area' }],
  links: [String],
  active: Boolean
});

module.exports = mongoose.model("Profile", ProfileSchema);