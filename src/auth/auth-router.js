'use strict';

const express = require('express');
const authRouter = express.Router();

const User = require('./models/users.js');
const basicAuth = require('./middleware/basic.js')
const bearerAuth = require('./middleware/bearer.js')
const permissions = require('./middleware/acl.js')

authRouter.post('/signup', async (req, res) => {
  try {
    let user = new User(req.body);
    const userRecord = await user.save();
    const output = {
      user: userRecord,
      token: userRecord.token
    };
    res.cookie("auth", userRecord.token);
    res.set("auth", userRecord.token);
    res.status(201).json(output);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

authRouter.post('/signin', basicAuth, (req, res) => {
  const user = {
    user: req.user,
    token: req.user.token
  };
  res.cookie("auth", req.user.token);
  res.set("auth", req.user.token);
  res.status(200).json(user);
});

authRouter.get('/users', bearerAuth, permissions('delete'), async (req, res) => {
  const users = await User.find({});
  const list = users.map(user => user.username);
  res.status(200).json(list);
});

authRouter.get('/secret', bearerAuth, async (req, res) => {
  res.status(200).send('Area for bearer authenticated users only');
});

authRouter.get('/editor', bearerAuth, permissions('create'), async (req, res) => {
  res.status(200).send('Area for bearer authenticated users with editor and admin privs only');
});

authRouter.get('/admin', bearerAuth, permissions('delete'), async (req, res) => {
  res.status(200).send('Area for bearer authenticated users with admin privs only');
});

module.exports = authRouter;
