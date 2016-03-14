// var request = require('request');

// var session = require('express-session');
var request = require('request');
// var locus = require('locus');

var music;
// var song;
var muzak;

var clientId = process.env.SOUNDCLOUD_CLIENT_ID;
// function test(user, cb) {
//   request('https://api.soundcloud.com/tracks?client_id=f4ddb16cc5099de27575f7bcb846636c', function (error, response, body) {
//     if (!error && response.statusCode == 200) {
//       music = JSON.parse(body);
//       cb(error, music);
//       // muzak = music[1];

//       // forEach(function(err, i) {
//       //   if (e.title === "Sorry") {
//       //     console.log(e);
//       //   }
//       // })
//       // console.log(body); // Show the HTML for the homepage.
//     }
//   })
// }

// test("user", function(err, music) {
//   console.log(music);
// });

// function buildUri(username) {
//   var user_id = username
//   request('https://api.soundcloud.com/users/'+ user_id +'/tracks?client_id=f4ddb16cc5099de27575f7bcb846636c', function(error, response, body) {
//     if (!error && response.statusCode == 200) {

//     }
//   })
// }

// function findSong (songs, cb) {
  // var trackId;

// finds song uri
request('https://api.soundcloud.com/tracks/251704061?client_id=f4ddb16cc5099de27575f7bcb846636c', function(err, res, body){
  if (!err && res.statusCode == 200) {
    console.log(JSON.parse(body).uri);
    // var song = JSON.parse(body);
    }
})
  //   });
  // }

//finds 1 song by title
function findSong(title, cb) {
  request('https://api.soundcloud.com/tracks/' + title + '?client_id=f4ddb16cc5099de27575f7bcb846636c', function(err, res, body){
    if (!err && res.statusCode == 200) {
      var song = JSON.parse(body);
      cb(err, song);
      // console.log(song.title);
      // var song = JSON.parse(body);
    }
  })
}

findSong('ordinarypeople', function(err, s) {
  console.log(s);
});





// function searchUser(songs) {
//   request('http://soundcloud.com/connect/client_id=f4ddb16cc5099de27575f7bcb846636c', function(error, response, body) {
//     if(!error && response.statusCode === 200) {
//       console.log(songs);
//     }
//   })
// }


