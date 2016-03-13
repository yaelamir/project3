
var mongoose = require('mongoose'),
    debug    = require('debug')('app:models');


var upvoteSchema = new mongoose.Schema({
  song: {type: mongoose.Schema.Types.ObjectId,
         ref: "Song"},
  upvotes: Number,
  upvotee: [{type: mongoose.Schema.Types.ObjectId,
            ref: "Vurser"}]
})


var songSchema = new mongoose.Schema({
  title: String,
  artist: String,
  album: String,
  length: Number,
  track_id: String,
  upvotes_for: [upvoteSchema],
  upvoted_to: [upvoteSchema],
  playlists: {type: mongoose.Schema.Types.ObjectId,
             ref: "Playlist"}
});

var Song = mongoose.model('Song', songSchema);

module.exports = Song;
