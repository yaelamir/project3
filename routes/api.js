var express = require('express'),
    apirouter  = new express.Router();
    passport  = require('passport'); //ADDED FROM ROUTES/INDEX.JS


//OAUTH//
//*****//

//Soundcloud Oauth login route  //ADDED FROM ROUTES/INDEX.JS
apirouter.get('/soundcloud',
  passport.authenticate('soundcloud'));

//Soundcloud OAuth callback route  //ADDED FROM ROUTES/INDEX.JS
apirouter.get('/soundcloud/callback',
  passport.authenticate('soundcloud',
    { failureRedirect: '/' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

//Oauth logout  //ADDED FROM ROUTES/INDEX.JS
apirouter.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});


//APICALLS//
//********//


module.exports = apirouter;
