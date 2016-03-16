var _ = require('lodash');

var localEnvVars = {
  TITLE:      'vurs',
  SAFE_TITLE: 'vurs_app'
};

// Merge all environmental variables into one object.
module.exports = _.extend(process.env, localEnvVars);
