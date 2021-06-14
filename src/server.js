'use strict';

const express = require('express');
const cors = require('cors');

const taskRouter = require('./routes/tasks.js');
const aclRouter = require('./auth/auth-router.js');
const notFound = require('./error-handlers/404.js');
const serverError = require('./error-handlers/500.js');

const app = express();
app.use(express.json());

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes

app.use(aclRouter);
app.use(taskRouter);

// Error handlers (catch-alls)
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
