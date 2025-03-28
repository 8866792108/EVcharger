const mongoose = require('mongoose');

const JoinWithUsSchema = new mongoose.Schema({
  ownerName: { type: String, required: true },
  businessName: { type: String, required: true },
  stationLocation: { type: String, required: true },
  contactNumber: { type: String, required: true },
  email: { type: String, required: true },
  stationType: { type: String, required: true, enum: ['Cars', 'Bikes', 'Tesla', 'Bicycle', 'Auto Rickshaw'] },
  numberOfPorts: { type: Number, required: true },
  additionalInfo: { type: String },
  status: { type: String, default: "Pending" }
}, { timestamps: true });

const JoinWithUsModel = mongoose.model('JoinWithUs', JoinWithUsSchema);
module.exports = JoinWithUsModel;
