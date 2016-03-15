var Song = require("../models/Song");


module.exports = {
  show: show
};

function show(req, res, next) {
  Song.findById(req.params.id, function(error, Song){
    if (error)
      res.json({ message: 'Could not find the song you are looking for because ' + error});
      res.render('Song/show', {Song: Song});
    })
};

//TOP SONG FUNCTION GOES HERE


