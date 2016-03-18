var mongoose = require('./database');

var Vurser   = require('../models/Vurser');
var Song     = require('../models/Song');
// var Playlist = require('../models/Playlist');

var Vursers = [
  { // 0
    name:   "Bob"
  },
  { // 1
    name:   "Margaret Kalanchoe"
  }
];

var songs = [
  {
  title: "Ordinary People",
  artist: "John Legend",
  album: "Whatever",
  length: 2400,
  },
  {
  title: "Weight in Gold",
  artist: "Gallant",
  album: "Whatever",
  length: 2700,
  }
];


Vurser.remove({}, function(err) {
  Song.remove({}, function(err) {
    // Playlist.remove({}, function(err) {
      var thesong,
          upvotedsong,
          upvoteperson1,
          upvoteperson2;
      if (err) console.log(err);

      //CREATE A NEW VURSER
      Vurser.create(Vursers, function(err, Vursers) {
        if (err) {
          console.log(err);
        } else {
          console.log("Database seeded with " + Vursers.length  + " Vursers.");
        }
      });

      //CREATE A NEW SONG
      Song.create(songs, function(err, songs) {
        if (err) {
          console.log(err);
        } else {
          console.log("database seeded with " + songs.length + " songs!");
        }
      });

      //ADD NEW RECOMMENDATION.
      Song.find({title: "Ordinary People"}, function(err, song) {
        thesong = song[0];
        // Song.find({title: "Weight in Gold"}, function(err, song) {
        //   upvotedsong = song[0];
        // });
        Vurser.find({}, function(err, vurser) {
          upvoteperson1 = vurser[0];
          upvoteperson2 = vurser[1];
          thesong.recommendations.push({song: upvotedsong, upvotee: upvoteperson1});
          thesong.recommendations[0].upvotee.push(upvoteperson2)
          thesong.recommendations[0].upvotes = thesong.recommendations[0].upvotee.length;
          thesong.save(function(err) {
            // console.log(err);
            process.exit(0);
          })
        });
      });
  });
})

