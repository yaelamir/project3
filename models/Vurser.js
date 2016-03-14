var mongoose = require('mongoose'),
    debug    = require('debug')('app:models');



var vurserSchema = new mongoose.Schema({
  name:   String,
  soundcloud_username: String,
  soundcloud_id: String,
  playlists: [{type: mongoose.Schema.Types.ObjectId, ref: "Playlist"}]
});

var Vurser = mongoose.model('Vurser', vurserSchema);

module.exports = Vurser;

