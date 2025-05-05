const Vehicle = require('../models/Vehicle');

const vehicleService = {
  AddVehicle: async (call, callback) => {
    const { make, model, year, available } = call.request;
    const newVehicle = new Vehicle({ make, model, year, available });

    try {
      await newVehicle.save();
      callback(null, { id: newVehicle._id.toString() });
    } catch (error) {
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
    } catch (err) {
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
    } catch (err) {
      callback(err);
    }
  },

  DeleteVehicle: async (call, callback) => {
    try {
      await Vehicle.findByIdAndDelete(call.request.id);
      callback(null, {});
    } catch (err) {
      callback(err);
    }
  }
};

module.exports = vehicleService;
