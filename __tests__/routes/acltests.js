'use strict';

process.env.SECRET = "keyboard cat";

const supergoose = require('@code-fellows/supergoose');
const { server } = require('../../src/server.js');
const mockRequest = supergoose(server);

let validItem = { task: 'Walk the dog', person: "John Doe", difficulty: 7, completed: false };
let validItem2 = { task: 'Walk the dog', person: "John Doe", completed: false };
let updItem = { completed: true };
let invalidItem = { task: "do something", completed: false };

describe("BEARER AUTH ROUTES WITH ACL implemented", () => {

  let users = [
    { username: 'admin', password: 'password', role: 'admin' },
    { username: 'editor', password: 'password', role: 'editor' },
    { username: 'user', password: 'password', role: 'user' },
  ]

  let registeredUsers = {};

  // Assign tokens to users of different roles
  beforeAll( async () => {
    let newAdmin = await mockRequest.post('/signup').send(users[0]);
    registeredUsers.admin = newAdmin.body.token;
    let newEditor = await mockRequest.post('/signup').send(users[1]);
    registeredUsers.editor = newEditor.body.token;
    let newUser = await mockRequest.post('/signup').send(users[2]);
    registeredUsers.user = newUser.body.token;
  })

  afterAll(() => {
    server.close();
  })

  TESTS TO POST: /api/v2/:model
  xtest('that a user with no token cannot access the create route', async () => {
    await mockRequest.post('/task').send(validItem)
      .then(reply => {
        expect(reply.status).toEqual(500);
      })
  })

  xtest('that a user with a bearer token but with no create permission cannot create a task', async () => {
    //sign in with user that has no create function
    let token = registeredUsers.user;
    await mockRequest.post('/task')
                     .send(validItem)
                     .set('Authorization', `${token}`)
                     .then(reply => {
                       expect(reply.status).toBe(500);
                     })
  })

  xtest('that a user with a bearer token and create permission can create a task', async () => {
    //sign in with editor who has create function
    let token = registeredUsers.editor;
    await mockRequest.post('/task')
                     .send(validItem)
                     .set('Authorization', `${token}`)
                     .then(reply => {
                       expect(reply.status).toBe(201);
                       expect(reply.body.task).toBe('Walk the dog');
                       expect(reply.body._id).toBeTruthy();
                     })
  })

  // TESTS TO GET /task
  xtest('that users with no token cannot access the read routes', async () => {
    await mockRequest.get('/task')
      .then(reply => {
        expect(reply.status).toBe(500);
      })
  })

  xtest('that users with bearer token and read permissions can see list of items', async () => {
    //sign in with editor who has read privileges (and create privileges)
    let token = registeredUsers.editor;
    await mockRequest.post('/task')
                     .send(validItem)
                     .set('Authorization', `${token}`);
    await mockRequest.get('/task').set('Authorization', `${token}`)
      .then(reply => {
        expect(reply.status).toBe(200);
        expect(reply.body[0].task).toEqual('Walk the dog');
      })
  })

  // TESTS TO GET /task/:id
  xtest('that users with no authorization cannot access model by id', async () => {
    let token = registeredUsers.editor;
    const newItem = await mockRequest.post('/task')
                     .send(validItem)
                     .set('Authorization', `${token}`);
    let itemId = newItem.body._id;
    await mockRequest.get(`/task/${itemId}`)
      .then(reply => {
        expect(reply.status).toBe(500);
      })
  })

  xtest('that users with read properties can access model by id', async () => {
    let token = registeredUsers.editor;
    const newItem = await mockRequest.post('/task')
                     .send(validItem)
                     .set('Authorization', `${token}`);
    let itemId = newItem.body._id;
    await mockRequest.get(`/task/${itemId}`).set('Authorization', `${token}`)
      .then(reply => {
        expect(reply.status).toBe(200);
        expect(reply.body._id).toEqual(itemId);
      })
  })

  // TESTS TO PUT /task/:id
  xtest('that users with no authorization cannot update model by id', async () => {
    let token = registeredUsers.admin;
    const newItem = await mockRequest.post('/task')
                     .send(validItem)
                     .set('Authorization', `${token}`);
    let itemId = newItem.body._id;
    await mockRequest.put(`/task/${itemId}`).send(updItem)
      .then(reply => {
        expect(reply.status).toBe(500);
      })
  })

  xtest('that users with update properties can update model by id', async () => {
    let token = registeredUsers.editor;
    const newItem = await mockRequest.post('/task')
                     .send(validItem)
                     .set('Authorization', `${token}`);
    let itemId = newItem.body._id;
    await mockRequest.put(`/task/${itemId}`)
                     .set('Authorization', `${token}`)
                     .send(updItem)
      .then(reply => {
        expect(reply.status).toBe(200);
        expect(reply.body._id).toEqual(itemId);
        expect(reply.body.task).toEqual('Walk the dog');
        expect(reply.body.completed).toEqual(true);
      })
   await mockRequest.get(`/task/${itemId}`)
                    .set('Authorization', `${token}`)
      .then(reply => {
        expect(reply.status).toBe(200);
        expect(reply.body.completed).toBe(true);
      })
  })

  // TESTS TO PUT /task/:id
  xtest('that users with no authorization cannot delete a model by id', async () => {
    let token = registeredUsers.admin;
    const newItem = await mockRequest.post('/task')
                     .send(validItem)
                     .set('Authorization', `${token}`);
    let itemId = newItem.body._id;
    await mockRequest.delete(`/task/${itemId}`)
      .then(reply => {
        expect(reply.status).toBe(500);
      })
  })

  xtest('that users without delete capability cannot delete a model by id', async () => {
    let token = registeredUsers.admin;
    const newItem = await mockRequest.post('/task')
                     .send(validItem)
                     .set('Authorization', `${token}`);
    let itemId = newItem.body._id;
    token = registeredUsers.editor;
    await mockRequest.delete(`/task/${itemId}`).set('Authorization', `${token}`)
      .then(reply => {
        expect(reply.status).toBe(500);
      })
  })

  xtest('that users with delete properties can delete model by id', async () => {
    let token = registeredUsers.admin;
    const newItem = await mockRequest.post('/task')
                     .send(validItem)
                     .set('Authorization', `${token}`);
    let itemId = newItem.body._id;
    await mockRequest.delete(`/task/${itemId}`)
                     .set('Authorization', `${token}`)
      .then(reply => {
        expect(reply.status).toBe(200);
        expect(reply.body._id).toEqual(itemId);
        expect(reply.body.task).toEqual('Walk the dog');
        expect(reply.body.completed).toEqual(false);
      })
    await mockRequest.get(`/task/${itemId}`)
                    .set('Authorization', `${token}`)
      .then(reply => {
        expect(reply.status).toBe(200);
      })
  })

})
