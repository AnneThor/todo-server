'use strict';

const express = require('express');
const taskModel = require('../models/tasks.js');
const genericCollection = require('../models/generic-collection.js');
const taskCollection = new genericCollection(taskModel);
const taskRouter = new express.Router();

taskRouter.get('/task', async (req,res) => {
  const tasks = await taskCollection.get();
  res.status(200).send(tasks);
});

taskRouter.get('/task/:id', async (req, res) => {
  const task = await taskCollection.get(req.params.id);
  res.status(200).send(task);
});

taskRouter.post('/task', async (req, res) => {
  const newtask = await taskCollection.create(req.body);
  res.status(201).send(newtask);
});

taskRouter.put('/task/:id', async (req, res) => {
  const updtask = await taskCollection.update(req.params.id, req.body);
  res.status(200).send(updtask);
});

taskRouter.delete('/task/:id', async (req, res) => {
  const deletedtask = await taskCollection.delete(req.params.id);
  res.status(200).send(deletedtask);
});

module.exports = taskRouter;
