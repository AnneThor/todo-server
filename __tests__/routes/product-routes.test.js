'use strict';

require('@code-fellows/supergoose');

const supertest = require('supertest');
const { products } = require('../../src/routes/products.js'); //productRouter

const mongoose = require('mongoose');
const productModel = require('../../src/models/products.js');
const genericCollection = require('../../src/models/generic-collection.js');
const testDB = new genericCollection(productModel);

const { server } = require('../../src/server.js');
const mockRequest = supertest(server);

describe('PRODUCT ROUTES functionality', () => {

  beforeEach(() => {
    for(let i=0; i<5; i++) {
      testDB.create({ "name": "newName"+`${i}`, "cost": i });
    };
  });

  afterEach(() => {
    return testDB.deleteAll();
  });

  it('should return a 404 on a bad method', async () => {
    await mockRequest.post('/product/5')
      .then(reply => {
        expect(reply.status).toBe(404);
      });
  });

  it('should return 404 on a bad route', async () => {
    await mockRequest.get('/unknown-route')
      .then(reply => {
        expect(reply.status).toBe(404);
      })
  });

  it('GET /product endpoint should return all product records', async () => {
    await mockRequest.get('/product')
      .then(reply => {
        expect(reply.status).toBe(200);
        expect(reply.body.length).toBe(5);
      });
  });

  it('GET /product/:id endpoint should return one result with the matching id', () => {
    return testDB.create({"name": "idName", "cost": 100 })
      .then( async(newCategory) => {
        await mockRequest.get(`/product/${newCategory._id}`)
          .then(reply => {
            expect(reply.status).toBe(200);
            expect(reply.body.name).toEqual("idName");
            expect(reply.body.cost).toEqual(100);
          });
      });
  });

  it('POST /product should return a newly created database entry', async () => {
    await mockRequest.post('/product').send({ "name": "postedName", "cost": 100, onSale: true })
      .then(reply => {
        expect(reply.status).toBe(201);
        expect(reply.body.name).toEqual('postedName');
        expect(reply.body.cost).toEqual(100);
        expect(reply.body.onSale).toBeTruthy();
      });
  });

  it('PUT /product/:id should update the existing record', () => {
    return testDB.create({ "name": "idName", "cost": 100 })
      .then( async(newCategory) => {
          await mockRequest.put(`/product/${newCategory._id}`).send({ "name": "updatedName", "cost": 150 })
            .then(reply => {
              expect(reply.status).toBe(200);
              expect(reply.body.name).toEqual('updatedName');
              expect(reply.body.cost).toEqual(150);
            });
      });
  });

  it('DELETE /product/:id should delete the record with given id', () => {
    return testDB.create({ "name": "deleteName", "cost": 100 })
      .then( async( foundCategory ) => {
        await mockRequest.delete(`/product/${foundCategory._id}`)
          .then(reply => {
            expect(reply.status).toBe(200);
            expect(reply.body.name).toEqual("deleteName")
          })
      })
      .then(async() => {
        await mockRequest.get('/product')
          .then(reply => {
            expect(reply.body.length).toEqual(5);
          })
      })
  })

})
