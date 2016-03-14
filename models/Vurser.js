var mongoose = require('mongoose'),
    debug    = require('debug')('app:models');


var playlistSchema = new mongoose.Schema({
  title: String,
  songs: [{type: mongoose.Schema.Types.ObjectId,
           ref: "Song"}]
});

var vurserSchema = new mongoose.Schema({
  name:   String,
  soundcloud_username: String,
  soundcloud_id: String,
  playlists: [playlistSchema]
});

var Vurser = mongoose.model('Vurser', vurserSchema);

module.exports = Vurser;

