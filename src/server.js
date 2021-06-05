'use strict';

const express = require('express');
const logger = require('./middleware/logger.js');
const taskRouter = require('./routes/tasks.js');
const notFound = require('./error-handlers/404.js');
const serverError = require('./error-handlers/500.js');

const app = express();

app.use(express.json());

app.use(logger);
app.use(taskRouter);
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
