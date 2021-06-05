'use strict';

const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
  task: { type: String, required: true },
  person: { type: String, required: true },
  difficulty: { type: Number, required: true },
  completed: { type: Boolean, default: false }
});

//create the model
const taskModel = mongoose.model('task', taskSchema);

module.exports = taskModel;
