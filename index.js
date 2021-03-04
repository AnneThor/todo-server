'use strict';

const server = require('./src/server.js');
require('dotenv').config();
const PORT = process.env.PORT || 3333;

const mongoose = require('mongoose');
const options = { useNewUrlParser: true, useUnifiedTopology: true };
mongoose.connect('mongodb://localhost:27017/api-server', options)
  .then(server.start(PORT));
