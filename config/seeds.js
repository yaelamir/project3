var mongoose = require('./database');

var Vurser = require('../models/Vurser');
var Song = require('../models/Song');
var Playlist = require('../models/Playlist');

var Vursers = [
  { // 0
    name:   "Bob"
  },
  { // 1
    name:   "Margaret Kalanchoe"
  }
];

var Songs = [
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
    Playlist.remove({}, function(err) {
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
      Song.create(Songs, function(err, Songs) {
        if (err) {
          console.log(err);
        } else {
          console.log("database seeded with " + Songs.length + " songs!");
        }
      });

      //ADD NEW RECOMMENDATION.
      Song.find({title: "Ordinary People"}, function(err, song) {
        thesong = song[0];
      });
      Song.find({title: "Weight in Gold"}, function(err, song) {
        upvotedsong = song[0];
      });
      Vurser.find({}, function(err, vurser) {
        upvoteperson1 = vurser[0];
        upvoteperson2 = vurser[1];
        thesong.recommendations.push({song: upvotedsong, upvotee: upvoteperson1});
        thesong.recommendations[0].upvotee.push(upvoteperson2)
        thesong.recommendations[0].upvotes = thesong.recommendations[0].upvotee.length;
        thesong.save(function(err) {
          // console.log(err);
        })

      });

      //CREATE A PLAYLIST
      Playlist.create({title: "beatz."}, function(err, playlist) {
        if (err) console.log(err);

        console.log("database seeded with  a playlist: " + playlist.title);
      })

      //ADD SONG TO A PLAYLIST
      Playlist.find({title: "beatz."}, function(err, playlist) {
        if (err) console.log(err);
        console.log(playlist.songs);
        console.log(thesong);
        playlist[0].songs.push(thesong);
        console.log("heres your playlist: " + playlist[0])
      })
    })
  });
})

