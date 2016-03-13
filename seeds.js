var mongoose = require('./config/database');

var Vurser = require('./models/Vurser');
var Song = require('./models/Song');


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
    var thesong,
        upvotedsong,
        upvoteperson1,
        upvoteperson2;
    if (err) console.log(err);
    Vurser.create(Vursers, function(err, Vursers) {
      if (err) {
        console.log(err);
      } else {
        console.log("Database seeded with " + Vursers.length  + " Vursers.");
      }
    });
    Song.create(Songs, function(err, Songs) {
      if (err) {
        console.log(err);
      } else {
        console.log("database seeded with " + Songs.length + " songs!");
      }
    });
    Song.find({title: "Ordinary People"}, function(err, song) {
      // console.log(song[0]);
      thesong = song[0];
      // console.log(thesong);
    });
    Song.find({title: "Weight in Gold"}, function(err, song) {
      // console.log(song[0]);
      upvotedsong = song[0];
      // console.log(upvotedsong);
    });
    Vurser.find({}, function(err, vurser) {
      // console.log(vurser[0]);
      upvoteperson1 = vurser[0];
      upvoteperson2 = vurser[1];
      // console.log(upvoteperson);
      thesong.upvotes_for.push({song: upvotedsong, upvotes: 1, upvotee: upvoteperson1});
      // console.log(thesong);
      thesong.save(function(err) {
        // console.log(err);
      })
      Vurser.find({}, function(err, vurser) {
        // console.log(vurser);
      }),
      console.log(thesong.upvotes_for[0].upvotes)
      console.log(thesong.upvotes_for[0].upvotes ++)
      console.log(thesong.upvotes_for[0].upvotes)
      console.log(thesong.upvotes_for[0])
      console.log(thesong.upvotes_for[0].upvotee)
      // console.log("upvoteperson2: ", upvoteperson2)
      // thesong.upvotes_for[0].upvotee.push(upvoteperson2)
      // console.log(thesong.upvotes_for[0])
    });
  });
})

