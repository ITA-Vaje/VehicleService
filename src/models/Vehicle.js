const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  make: String,
  model: String,
  year: Number,
  available: Boolean
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
