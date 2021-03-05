'use strict';

const logger = require('../../src/middleware/logger.js');

describe('LOGGER MIDDLWARE', () => {

  const req = {};
  const res = {};
  let next = jest.fn();
  let spy;

  beforeEach(() => {
    spy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    spy.mockRestore();
  });

  it('should log some info about the req', () => {
    logger(req, res, next);
    expect(spy).toHaveBeenCalled();
  })

  it('should move to the next mw in the chain', () => {
    logger(req, res, next);
    expect(next).toHaveBeenCalledWith();
  })

})
