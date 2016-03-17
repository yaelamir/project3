var Vurser = require("../models/Vurser");
var Song = require("../models/Song");

module.exports = {
  show:  show,
  showCurrentUser: showCurrentUser,
  addPlaylist: addPlaylist
  // editPlaylist: editPlaylist
};


function show(req, res, next) {
  Vurser.findById(req.params.id, function(error, Vurser){
    if (error) res.json({message: 'Could not find Vurser because ' + error});
    res.render('Vursers/show', {Vurser: Vurser});
  });
};

function showCurrentUser(req, res, next) {
  if (!req.isAuthenticated()) {
    res.status(403).send("User not logged in!");
  } else {
    Vurser
      .findById(req.user._id)
      .populate("playlists.songs")
      .exec(function(err, user) {
        if (err) {
          res.send(err);
        } else {
          res.json(user);
        }
      });
  }
}

function addPlaylist(req, res) {
  req.user.playlists.push({
    title: req.body.title,
    songs: []
  });
  req.user.save(function(err) {
    var pl = req.user.playlists[req.user.playlists.length-1];
    res.json(pl);
  });
}

// function editPlaylist(req, res) {
//   req.user.playlists{}
// }
