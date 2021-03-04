'use strict';

const express = require('express');
const logger = require('./middleware/logger.js');
const categoryRouter = require('./routes/categories.js');
const productRouter = require('./routes/products.js');
const notFound = require('./error-handlers/404.js');
const serverError = require('./error-handlers/500.js');

const app = express();

app.use(express.json());

app.use(logger);
app.use(categoryRouter);
app.use(productRouter);
app.use('*', notFound);
app.use(serverError);

module.exports = {
  server: app,
  start: (port) => {
    app.listen(port, () => {
      console.log(`Listening on port ${port}`);
    });
  },
};
