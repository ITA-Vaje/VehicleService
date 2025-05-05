const logger = require('../logger');
const Vehicle = require('../models/Vehicle');

const vehicleService = {
  AddVehicle: async (call, callback) => {
    const { make, model, year, available } = call.request;
    const newVehicle = new Vehicle({ make, model, year, available });

    try {
      await newVehicle.save();
      callback(null, { id: newVehicle._id.toString() });
      logger.info('AddVehicle executed.');
    } catch (error) {
      logger.error('Error occurred:', error);
      callback(error);
    }
  },

  GetVehicle: async (call, callback) => {
    try {
      const vehicle = await Vehicle.findById(call.request.id);
      if (!vehicle) return callback(new Error("Vehicle not found"));
      callback(null, {
        id: vehicle._id.toString(),
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        available: vehicle.available
      });
      logger.info('GetVehicle executed.');
    } catch (err) {
      logger.error('Error occurred:', err);
      callback(err);
    }
  },

  ListVehicles: async (_, callback) => {
    try {
      const vehicles = await Vehicle.find();
      callback(null, {
        vehicles: vehicles.map(v => ({
          id: v._id.toString(),
          make: v.make,
          model: v.model,
          year: v.year,
          available: v.available
        }))
      });
      logger.info('ListVehicles executed.');
    } catch (err) {
      logger.error('Error occurred:', err);
      callback(err);
    }
  },

  DeleteVehicle: async (call, callback) => {
    try {
      await Vehicle.findByIdAndDelete(call.request.id);
      callback(null, {});
      logger.info('DeleteVehicle executed.');
    } catch (err) {
      logger.error('Error occurred:', err);
      callback(err);
    }
  }
};

module.exports = vehicleService;
