'use strict';

module.exports = (req, res, next) => {
  console.log('Details: ', req.method, req.url);
  next();
};
