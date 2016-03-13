
var mongoose = require('mongoose'),
    debug    = require('debug')('app:models');



var vurserSchema = new mongoose.Schema({
  name:   String,
  soundcloud_id: String
});

var Vurser = mongoose.model('Vurser', vurserSchema);

module.exports = Vurser;

