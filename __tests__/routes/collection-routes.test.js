'use strict';

require('@code-fellows/supergoose');

const supertest = require('supertest');
const { categories } = require('../../src/routes/categories.js'); //categoryRouter

const mongoose = require('mongoose');
const categoryModel = require('../../src/models/categories.js');
const genericCollection = require('../../src/models/generic-collection.js');
const testDB = new genericCollection(categoryModel);

const { server } = require('../../src/server.js');
const mockRequest = supertest(server);

describe('CATEGORY ROUTES functionality', () => {

  //pre populate database, it should create 5 records before each test
  beforeEach(() => {
    for(let i=0; i<5; i++) {
      testDB.create({ "name": "newName"+`${i}` });
    };
  });

  afterEach(() => {
    return testDB.deleteAll();
  });

  it('should return a 404 on a bad method', async () => {
    await mockRequest.post('/category/5')
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

  it('GET /category endpoint should return all category records', async () => {
    await mockRequest.get('/category')
      .then(reply => {
        expect(reply.status).toBe(200);
        expect(reply.body.length).toBe(5);
      });
  });

  it('GET /category/:id endpoint should return one result with the matching id', () => {
    return testDB.create({"name": "idName"})
      .then( async(newCategory) => {
        await mockRequest.get(`/category/${newCategory._id}`)
          .then(reply => {
            expect(reply.status).toBe(200);
            expect(reply.body._id).toBeTruthy();
            expect(reply.body.name).toEqual("idName");
          });
      });
  });

  it('POST /category should return a newly created database entry', async () => {
    await mockRequest.post('/category').send({ "name": "postedName"})
      .then(reply => {
        expect(reply.status).toBe(201);
        expect(reply.body.name).toEqual('postedName');
      });
  });

  it('PUT /category/:id should update the existing record', () => {
    return testDB.create({ "name": "idName" })
      .then( async(newCategory) => {
          await mockRequest.put(`/category/${newCategory._id}`).send({ "name": "updatedName" })
            .then(reply => {
              expect(reply.status).toBe(200);
              expect(reply.body.name).toEqual('updatedName');
            });
      });
  });

  it('DELETE /category/:id should delete the record with given id', () => {
    return testDB.create({ "name": "deleteName" })
      .then( async( foundCategory ) => {
        await mockRequest.delete(`/category/${foundCategory._id}`)
          .then(reply => {
            expect(reply.status).toBe(200);
            expect(reply.body.name).toEqual("deleteName");
          })
        await mockRequest.get('/category')
          .then(reply => {
            console.log(`REPLY BODY`, reply.body)
            expect(reply.body.length).toEqual(5);
          })
      })
  })

})
