'use strict';

class GenericCollection {

  /**
  * Constructor function creating the generic collection object
  * @param {object} - mongoose model object
  */
  constructor(model){
    this.model = model;
  }

  /**
  * Takes a mongoose _id as an input and returns the record with the corresponding id
  * @param {string} _id - mongoose id
  */
  get(_id){
    if (_id) {
      return this.model.findById({_id: _id});
    } else {
      return this.model.find({});
    }
  }

  /**
  * Accepts an input object, creates a record with the input details and saves the record
  * to the collection; returns the record it creates or err message if there is an error
  * @param {object} - object of key/value pairs to create new record with
  */
  create(record) {
    const newRecord = new this.model(record);
    return newRecord.save();
  }

  /**
  * Accepts a mongoose string _id and an object with details; finds the object with the
  * input _id if it exists in database and updates with record; returns updated record
  * @param {string} - mongoose _id hash
  * @param {object} - key/value pairs holding document data
  */
  update(_id, record) {
    return this.model.findByIdAndUpdate(_id, record, { new: true });
  }

  /**
  * Accepts a mongoose string _id and deletes this document from the database if it
  * exists
  * @param {string} - a mongoose _id string
  */
  delete(_id) {
    return this.model.findOneAndDelete({ _id: _id })
  }

  deleteAll() {
    return this.model.deleteMany({})
  }

}

module.exports = GenericCollection;
