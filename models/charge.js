/* ===================
   Import Node Modules
=================== */
const mongoose = require('mongoose'); // Node Tool for MongoDB
mongoose.Promise = global.Promise; // Configure Mongoose Promises
const Schema = mongoose.Schema; // Import Schema from Mongoose

// Blog Model Definition
const chargeSchema = new Schema({
  appointmentId: {
    type: String,
    required: true
  },
  chargeId: {
    type: String,
    required: true
  },
  user: {
    type: String,
    required: true
  },
  paymentMethod: {
    type: String,
    required: true
  },
  isRefunded: {
    type: Boolean,
    default: false
  },
  createdAt: {type: Date, default: Date.now()},
});

// Export Module/Schema
module.exports = mongoose.model('Charge', chargeSchema);
