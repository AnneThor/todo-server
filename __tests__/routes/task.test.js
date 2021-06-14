'use strict';

process.env.SECRET = "keyboard cat";

const supergoose = require('@code-fellows/supergoose');
const { server } = require('../../src/server.js');
const mockRequest = supergoose(server);

let validItem = { task: 'Walk the dog', person: "John Doe", difficulty: 7, completed: false };
let validItem2 = { task: 'Walk the dog', person: "John Doe", completed: false };
let updItem = { completed: true };
let invalidItem = { task: "do something", completed: false };

describe("Unauthenticated Server Routes", () => {

  // test('that POST to /task with invalid inputs returns an error', async () => {
  //   await mockRequest.post('/task').send(invalidItem)
  //     .then(reply => {
  //       expect(reply.status).toBe(500);
  //       expect(reply.body.message).toEqual('database error');
  //     })
  // })

  test('that GET /task returns an empty object if no records', async () => {
    await mockRequest.get('/task')
      .then(reply => {
        expect(reply.status).toBe(200);
        expect(reply.body).toEqual([]);
      })
  })

  test('that POST to /task creates and returns object from db', async () => {
    await mockRequest.post('/task').send(validItem)
      .then(reply => {
        expect(reply.status).toBe(201);
        expect(reply.body.task).toEqual('Walk the dog');
        expect(reply.body._id).toBeTruthy();
      })
  })

  test('that GET /task returns a list of model items', async () => {
    await mockRequest.post('/task').send(validItem)
      .then( await mockRequest.get('/task')
        .then(reply => {
          expect(reply.status).toBe(200);
          expect(reply.body).toBeTruthy();
          expect(reply.body[0].task).toEqual('Walk the dog');
        }))
      })

  test('that GET to /task/:id returns a single item by id', async () => {
    const createRec = await mockRequest.post('/task').send(validItem)
    const newItemId = createRec.body._id;
    await mockRequest.get(`/task/${newItemId}`)
      .then(reply => {
        expect(reply.status).toBe(200);
        expect(reply.body.task).toBe('Walk the dog');
        expect(reply.body._id).toEqual(newItemId);
      })
  });

  test('that PUT to /task returns a single, updated item by id', async () => {
    let itemList = await mockRequest.get('/task');
    let item = itemList.body[0];
    let itemID = item._id;
    let updItem = { completed: true };
    await mockRequest.put(`/task/${itemID}`).send(updItem)
      .then(reply => {
        expect(reply.status).toBe(200);
        expect(reply.body.completed).toEqual(true);
      })
    await mockRequest.get(`/task/${itemID}`)
      .then(reply => {
        expect(reply.status).toBe(200);
        expect(reply.body.task).toEqual('Walk the dog');
      })
  })

  test('that DELETE to /task/:id returns an empty object', async () => {
    const createRec = await mockRequest.post('/task').send(validItem)
    const newItemId = createRec.body._id;
    await mockRequest.delete(`/task/${newItemId}`)
      .then(reply => {
        expect(reply.status).toBe(200);
        expect(reply.body.task).toBe('Walk the dog');
      });
    await mockRequest.get(`/task/${newItemId}`)
      .then(reply => {
        expect(reply.status).toBe(200);
      })
  })

})
