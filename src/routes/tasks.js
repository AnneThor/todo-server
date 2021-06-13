'use strict';

const express = require('express');
const taskModel = require('../models/tasks.js');
const genericCollection = require('../models/generic-collection.js');
const taskCollection = new genericCollection(taskModel);
const bearerAuth = require('../auth/middelware/bearer.js');
const restrict = require('../auth/middleware/acl.js');
const taskRouter = new express.Router();

// all routes are restricted to bearer auth
// meaning those with jwt only
taskRouter.use(bearerAuth);

// anyone with valid jwt can use get methods
taskRouter.get('/task', async (req,res) => {
  const tasks = await taskCollection.get();
  res.status(200).send(tasks);
});
taskRouter.get('/task/:id', async (req, res) => {
  const task = await taskCollection.get(req.params.id);
  res.status(200).send(task);
});

// restricted to users with CREATE capability
taskRouter.post('/task', restrict('create'), async (req, res) => {
  const newtask = await taskCollection.create(req.body);
  res.status(201).send(newtask);
});

// restricted to users with UPDATE capability
taskRouter.put('/task/:id', restrict('update'), async (req, res) => {
  const updtask = await taskCollection.update(req.params.id, req.body);
  res.status(200).send(updtask);
});

// restrict to users with DELETE capability
taskRouter.delete('/task/:id', restrict('delete'), async (req, res) => {
  const deletedtask = await taskCollection.delete(req.params.id);
  res.status(200).send(deletedtask);
});

module.exports = taskRouter;
