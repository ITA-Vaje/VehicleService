// test/vehicle.test.js
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const mongoose = require('mongoose');

const PROTO_PATH = path.join(__dirname, '../src/proto/vehicle.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const vehicleProto = grpc.loadPackageDefinition(packageDefinition).vehicle;

const client = new vehicleProto.VehicleService(
  'localhost:50051',
  grpc.credentials.createInsecure()
);

beforeAll(async () => {
  await mongoose.connect('mongodb+srv://pts-user:pts-user@clusterpts.ihmpmb6.mongodb.net/VehicleDB?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('VehicleService', () => {
  let vehicleId;

  it('should add a vehicle', done => {
    const request = {
      make: 'Toyota',
      model: 'RAV4',
      year: 2021,
      available: true
    };

    client.AddVehicle(request, (err, response) => {
      expect(err).toBeNull();
      expect(response).toHaveProperty('id');
      vehicleId = response.id;
      done();
    });
  }, 10000);

  it('should get the added vehicle', done => {
    const request = { id: vehicleId };

    client.GetVehicle(request, (err, response) => {
      expect(err).toBeNull();
      expect(response.id).toBe(vehicleId);
      expect(response.make).toBe('Toyota');
      expect(response.model).toBe('RAV4');
      expect(response.year).toBe(2021);
      expect(response.available).toBe(true);
      done();
    });
  }, 10000);

  it('should list all vehicles', done => {
    client.ListVehicles({}, (err, response) => {
      expect(err).toBeNull();
      expect(response.vehicles).toBeInstanceOf(Array);
      expect(response.vehicles.length).toBeGreaterThan(0);
  
      const found = response.vehicles.find(v => v.make === 'Toyota' && v.model === 'RAV4');
      expect(found).toBeDefined();
      done();
    });
  }, 10000);

  it('should delete a vehicle', done => {
    const request = { id: vehicleId };
  
    client.DeleteVehicle(request, (err, response) => {
      expect(err).toBeNull();
      expect(response).toEqual({});
      
      client.GetVehicle(request, (err2, response2) => {
        expect(err2).toBeTruthy(); 
        done();
      });
    });
  }, 10000);
  

});
