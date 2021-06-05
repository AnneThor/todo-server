'use strict';

const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
  name: { type: String, required: true },
  keywords: {
    type: [String],
    default: [],
  },
});

//create the model
const categoryModel = mongoose.model('category', categorySchema);

module.exports = categoryModel;
