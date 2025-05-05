require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const vehicleRoutes = require('./routes/vehicles');

const app = express();
app.use(express.json());
app.use('/vehicles', vehicleRoutes);

const PORT = process.env.PORT || 3000;
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true })
  .then(() => {
    app.listen(PORT, () => console.log(`REST server on port ${PORT}`));
  });