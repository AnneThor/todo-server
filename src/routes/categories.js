'use strict';

const express = require('express');
const categoryModel = require('../models/categories.js');
const genericCollection = require('../models/generic-collection.js');
const categoryCollection = new genericCollection(categoryModel);
const categoryRouter = new express.Router();

categoryRouter.get('/category', async (req,res) => {
  const categories = await categoryCollection.get();
  res.status(200).send(categories);
});
categoryRouter.get('/category/:id', async (req, res) => {
  const category = await categoryCollection.get(req.params.id);
  res.status(200).send(category);
});
categoryRouter.post('/category', async (req, res) => {
  const newCategory = await categoryCollection.create(req.body);
  res.status(201).send(newCategory);
});
categoryRouter.put('/category/:id', async (req, res) => {
  const updCategory = await categoryCollection.update(req.params.id, req.body);
  res.status(200).send(updCategory);
});
categoryRouter.delete('/category/:id', async (req, res) => {
  const deletedCategory = await categoryCollection.delete(req.params.id);
  res.status(200).send(deletedCategory);
});

module.exports = categoryRouter;
