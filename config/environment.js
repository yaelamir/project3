var _ = require('lodash');

var localEnvVars = {
  TITLE:      'V U R S',
  SAFE_TITLE: 'vurs_app'
};

// Merge all environmental variables into one object.
module.exports = _.extend(process.env, localEnvVars);
