'use strict';

const express = require('express');
const productModel = require('../models/products.js');
const genericCollection = require('../models/generic-collection.js');
const productCollection = new genericCollection(productModel);
const productRouter = new express.Router();

productRouter.get('/product', async (req,res) => {
  const products = await productCollection.get();
  res.status(200).send(products);
});
productRouter.get('/product/:id', async (req, res) => {
  const product = await productCollection.get(req.params.id);
  res.status(200).send(product);
});
productRouter.post('/product', async (req, res) => {
  const newCategory = await productCollection.create(req.body);
  res.status(201).send(newCategory);
});
productRouter.put('/product/:id', async (req, res) => {
  const updCategory = await productCollection.update(req.params.id, req.body);
  res.status(200).send(updCategory);
});
productRouter.delete('/product/:id', async (req, res) => {
  const deletedCategory = await productCollection.delete(req.params.id);
  res.status(200).send(deletedCategory);
});

module.exports = productRouter;
