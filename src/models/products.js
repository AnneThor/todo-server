'use strict';

const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  name: { type: String, required: true },
  cost: { type: Number, required: true },
  onSale: { type: Boolean, default: false },
});

const productModel = new mongoose.model('product', productSchema);

module.exports = productModel;
