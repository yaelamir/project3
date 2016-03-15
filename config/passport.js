var passport            = require('passport');
var SoundCloudStrategy  = require('passport-soundcloud').Strategy;
var Vurser              = require('../models/Vurser'),
    Song                = require('../models/Song');
var request             = require('request');
// Verify callback - Either fetch the user from DB, or make a new user

passport.use(new SoundCloudStrategy({
    clientID: process.env.SOUNDCLOUD_CLIENT_ID,
    clientSecret: process.env.SOUNDCLOUD_CLIENT_SECRET,
    callbackURL: process.env.SOUNDCLOUD_CALLBACK
  },
  function(accessToken, refreshToken, profile, cb) {
    //Initialize variables to integrate Vursers' soundcloud playlist
    var playlistInfo,
        playlistArray = [],
        songsArray    = [];
    //Looks for Vurser, otherwise creates new Vursers via OAuth
    Vurser.findOne({ soundcloud_id: profile.id }, function(err, vurser) {
      if (err) return cb(err);
      // If vurser exists, return vurser and redirect
      if (vurser) {
        return cb(null, vurser);
      // Otherwise create vurser here:
      } else {
      //API Call to grab users playlists
        request.get("http://api.soundcloud.com/users/" + profile.id + "/playlists?client_id=" + process.env.SOUNDCLOUD_CLIENT_ID,
          function(err, res, body) {
            playlistInfo = JSON.parse(body);
            // For each playlist in Vurser's soundcloud playlist,
            playlistInfo.forEach(function(playlist, playlistindex){
              //For each song in a playlist
              playlist.tracks.forEach(function(song, songindex) {
                //Create song in the DB
                Song.create(
                  {
                    title: song.title,
                    artist: song.user.username,
                    length: song.duration,
                    track_id: song.id
                  },
                  function(err, song) {
                    //Push this song into the songsArray
                    songsArray.push(song);
                    //If current number of songs matches number of songs in playlist,
                    if (songindex === playlist.tracks.length - 1) {
                      //Push finished array of songs into created playlist Array
                      playlistArray.push({
                        title: playlist.permalink,
                        songs: songsArray
                      });

                      songsArray = [];
                      //Finally, create new Vurser with their soundcloud playlist
                      if (playlistindex === playlistInfo.length - 1) {
                        var newVurser = new Vurser({
                          name: profile.full_name,
                          soundcloud_id: profile._json.id,
                          soundcloud_username: profile._json.username,
                          playlists: playlistArray
                        });
                        //Save and redirect
                        newVurser.save(function(err) {
                          if (err) return cb(err);
                          return cb(null, newVurser);
                        });
                      }
                    }
                  });
              })
            })
        })
      }
    });
  }
));

//Gives passport the data to put into a session for a specific user
passport.serializeUser(function(vurser, done) {
    done(null, vurser.id);
});


//Provides passport with the user from db that we want assigned to req.user
//Passport gave us the id from the session, and we use this to get the student
//and assign it to req.user
passport.deserializeUser(function(id, done) {
  Vurser.findById(id, function(err, vurser) {
    done(err, vurser);
  });
});



































