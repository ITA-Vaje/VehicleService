const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const mongoose = require('mongoose');
require('dotenv').config();
const path = require('path');
const logger = require('./logger');
const vehicleService = require('./services/vehicleService');

const PROTO_PATH = path.join(__dirname, 'proto', 'vehicle.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});
const vehicleProto = grpc.loadPackageDefinition(packageDefinition).vehicle;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

const server = new grpc.Server();
server.addService(vehicleProto.VehicleService.service, vehicleService);

const PORT = '0.0.0.0:50051';
server.bindAsync(PORT, grpc.ServerCredentials.createInsecure(), () => {
  logger.info(`gRPC server is running on ${PORT}`);
  server.start();
});
