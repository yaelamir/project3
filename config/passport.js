var passport            = require('passport');
var SoundCloudStrategy  = require('passport-soundcloud').Strategy;
var Vurser              = require('../models/Vurser');

passport.use(new SoundCloudStrategy({
    clientID: process.env.SOUNDCLOUD_CLIENT_ID,
    clientSecret: process.env.SOUNDCLOUD_CLIENT_SECRET,
    callbackURL: "http://127.0.0.1:3000/auth/soundcloud/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOrCreate({ soundcloudId: profile.id }, function (err, user) {
      return done(err, user);
    });
  }
));



passport.use(new SoundCloudStrategy({
    clientID: process.env.SOUNDCLOUD_CLIENT_ID,
    clientSecret: process.env.SOUNDCLOUD_CLIENT_SECRET,
    callbackURL: "http://127.0.0.1:3000/auth/soundcloud/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    Vurser.findOne({ 'soundcloud_id': profile.id }, function(err, vurser) {
      if (err) return cb(err);
      if (student) {
        return cb(null, student);
      } else {
        // we have a new student via OAuth!
        var newStudent = new Student({
          name: profile.displayName,
          email: profile.emails[0].value,
          googleId: profile.id
        });
        newStudent.save(function(err) {
          if (err) return cb(err);
          return cb(null, newStudent);
        });
      }
    });
  }
));





// ORIGINAL CODE
// passport.use(new SoundCloudStrategy({
//     clientID: process.env.SOUNDCLOUD_CLIENT_ID,
//     clientSecret: process.env.SOUNDCLOUD_CLIENT_SECRET,
//     callbackURL: "http://127.0.0.1:3000/auth/soundcloud/callback"
//   },
//   function(accessToken, refreshToken, profile, done) {
//     User.findOrCreate({ soundcloudId: profile.id }, function (err, user) {
//       return done(err, user);
//     });
//   }
// ));
