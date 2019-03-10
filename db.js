const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
let isConnected;

module.exports = connectToDatabase = async () => {
  if (isConnected) {
    console.log('=> using existing database connection');
    return isConnected;
  }

  console.log('=> using new database connection');

  const db = await mongoose.connect(process.env.MONGO_DB_URL)
  isConnected = db.connections[0].readyState;
  return isConnected;
};