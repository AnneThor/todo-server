'use strict';

const server = require('./src/server.js');
require('dotenv').config();
const PORT = process.env.PORT || 3333;
const MONGO_URI = process.env.MONGO_URI;

const mongoose = require('mongoose');
const options = { useNewUrlParser: true, useUnifiedTopology: true };
mongoose.connect(MONGO_URI, options)
  .then(server.start(PORT));
