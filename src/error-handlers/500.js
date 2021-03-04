'use strict';

module.exports = (err, req, res, next) => {
  let errorMessage = err.message ? err.message : 'Internal server error';
  res.status(500).json({
    status: 500,
    message: errorMessage,
  });
};
