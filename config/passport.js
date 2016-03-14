var passport            = require('passport');
var SoundCloudStrategy  = require('passport-soundcloud').Strategy;
var Vurser              = require('../models/Vurser');

// Verify callback - Either fetch the user from DB, or make a new user
passport.use(new SoundCloudStrategy({
    clientID: process.env.SOUNDCLOUD_CLIENT_ID,
    clientSecret: process.env.SOUNDCLOUD_CLIENT_SECRET,
    callbackURL: process.env.SOUNDCLOUD_CALLBACK
  },
  function(accessToken, refreshToken, profile, cb) {
    Vurser.findOne({ 'soundcloud_id': profile.id }, function(err, vurser) {
      if (err) return cb(err);
      if (vurser) {
        return cb(null, vurser);
      } else {
        // Creating a new vurser via OAuth
        var newVurser = new Vurser({
          name: profile.name,
          soundcloud_id: profile.id
        });
        newVurser.save(function(err) {
          if (err) return cb(err);
          return cb(null, newVurser);
        });
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



































