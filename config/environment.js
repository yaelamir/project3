var _ = require('lodash');

var localEnvVars = {
  TITLE:      'VURS',
  SAFE_TITLE: 'project3'
};

// Merge all environmental variables into one object.
module.exports = _.extend(process.env, localEnvVars);
