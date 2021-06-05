'use strict';

require('@code-fellows/supergoose');

const supertest = require('supertest');
const { tasks } = require('../../src/routes/tasks.js'); //categoryRouter

const mongoose = require('mongoose');
const taskModel = require('../../src/models/tasks.js');
const genericCollection = require('../../src/models/generic-collection.js');
const testDB = new genericCollection(taskModel);

const { server } = require('../../src/server.js');
const mockRequest = supertest(server);

describe('CATEGORY ROUTES functionality', () => {

  //pre populate database, it should create 5 records before each test
  beforeEach(() => {
    for(let i=0; i<5; i++) {
      testDB.create({ "task": `newTask ${i}`,
                      "person": `newTask ${i}`,
                      "difficulty": i,
                      "completed": false
                      });
    };
  });

  afterEach(() => {
    return testDB.deleteAll();
  });

  it('should return a 404 on a bad method', async () => {
    await mockRequest.post('/task/5')
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

  it('GET /task endpoint should return all task records', async () => {
    await mockRequest.get('/task')
      .then(reply => {
        expect(reply.status).toBe(200);
        expect(reply.body.length).toBe(5);
      });
  });

  it('GET /task/:id endpoint should return one result with the matching id', () => {
    return testDB.create({"task": "newTask",
      "person": "newPerson",
      "difficulty": 1,
      "completed": false
      })
      .then( async(newTask) => {
        await mockRequest.get(`/task/${newTask._id}`)
          .then(reply => {
            expect(reply.status).toBe(200);
            expect(reply.body._id).toBeTruthy();
            expect(reply.body.task).toEqual("newTask");
          });
      });
  });

  it('POST /task should return a newly created database entry', async () => {
    await mockRequest.post('/task')
    .send({ "task": "newTask", "person": "newPerson", "difficulty": 1, "completed": false})
      .then(reply => {
        expect(reply.status).toBe(201);
        expect(reply.body.person).toEqual('newPerson');
      });
  });

  it('PUT /task/:id should update the existing record', () => {
    return testDB.create({"task": "newTask", "person": "newPerson", "difficulty": 1, "completed": false })
      .then( async(newTask) => {
          await mockRequest.put(`/task/${newTask._id}`).send({ "person": "Annie" })
            .then(reply => {
              expect(reply.status).toBe(200);
              expect(reply.body.person).toEqual('Annie');
            });
      });
  });

  it('DELETE /task/:id should delete the record with given id', () => {
    return testDB.create({"task": "deleteTask", "person": "newPerson", "difficulty": 1, "completed": false })
      .then( async(newTask) => {
        await mockRequest.delete(`/task/${newTask._id}`)
          .then(reply => {
            expect(reply.status).toBe(200);
            expect(reply.body.task).toEqual("deleteTask");
          })
        await mockRequest.get('/task')
          .then(reply => {
            // this would be 6 if we hadn't deleted one
            expect(reply.body.length).toEqual(5);
          })
      })
  })

})
