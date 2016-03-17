
var mongoose = require('mongoose'),
    debug    = require('debug')('app:models');


var upvoteSchema = new mongoose.Schema({
  song: {type: mongoose.Schema.Types.ObjectId,
         ref: "Song"},
  upvotes: {type: Number, default: 1},
  upvotee: [{type: mongoose.Schema.Types.ObjectId,
            ref: "Vurser"}]
})


var songSchema = new mongoose.Schema({
  title: String,
  artist: String,
  length: Number,
  track_id: String,
  recommendations: [upvoteSchema],
});

var Song = mongoose.model('Song', songSchema);

module.exports = Song;
