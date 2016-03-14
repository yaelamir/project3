var mongoose = require('mongoose'),
    debug    = require('debug')('app:models');

var playlistSchema = new mongoose.Schema({
  title: String,
  songs: [{type: mongoose.Schema.Types.ObjectId,
           ref: "Song"}]
  vurser: {type: mongoose.Schema.Types.ObjectId,
           ref: "Vurser"}
});

var Playlist = mongoose.model('Playlist', playlistSchema);

module.exports = Playlist;
