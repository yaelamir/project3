// var Song = require("../models/Song");
var Vurser = require("../models/Vurser");


module.exports = {
  addPlaylist: addPlaylist
};

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
