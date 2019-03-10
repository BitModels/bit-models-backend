const mongoose = require('mongoose')

const AreaSchema = new mongoose.Schema({
  name: String,
  description: String,
  imageDescription: String,
  image: String,
  profiles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Profile' }],
});

module.exports = mongoose.model("Area", AreaSchema);