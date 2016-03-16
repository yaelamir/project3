var Song = require("../models/Song");


module.exports = {
  show: show,
  addRecommendation: addRecommendation
};

function show(req, res, next) {
  Song.findById(req.params.id, function(error, Song){
    if (error){
      res.json({ message: 'Could not find the song you are looking for because ' + error});
    } else {
      res.render('Song/show', {Song: Song});
    }
  })
};

function addRecommendation(req, res, next) {
  console.log("Hey: ", req.body);
  console.log("Hey req.params: ", req.params)
  Song.findOne({track_id: req.body.currentTrack}, function(error, song){
    console.log("Hey again: ", song);
    //IF song does not exist, create new entry
    if (song) {
      Song.findOne({track_id: req.body.recTrackId}, function(err, recSong){
        console.log("Hello recSong: ", recSong);

        if (recSong) {
          var foundRec = song.recommendations.filter(function (recsonginquestion) {
            console.log(recsonginquestion._id.toString() === recSong._id.toString())
            return recsonginquestion.song.toString() === recSong._id.toString();
          });
          if (foundRec.length === 0) {
            console.log("making new rec: ", foundRec, foundRec.length)
            song.recommendations.push({song: recSong, upvotee: req.body.user});
            song.save(function(err){
              console.log("errr: ", err)
              if (err) {
                res.json({error: "oh no! not saved", success: null})
              } else {
                res.json({error: null, success: "recommendations saved!"})
              }
            })
          } else {
            console.log("foundyouuuuu")
            foundRec[0].upvotes += 1;
            var foundRecperson = foundRec[0].upvotee.filter(function (recpersoninquestion) {
            return recpersoninquestion.toString() === req.body.user;
          });
            if (foundRecperson.length === 0) {
            foundRec[0].upvotee.push(req.body.user);
            }
            song.save(function(err){
              console.log("errr: ", err)
              if (err) {
                res.json({error: "oh no! not saved", success: null})
              } else {
                res.json({error: null, success: "recommendations saved!"})
              }
            })
          }
        } else {
          Song.create({
            title: req.body.recTrackTitle,
            artist: req.body.recTrackArtist,
            length: req.body.recTrackDuration,
            track_id: req.body.recTrackId,
            recommendations: []
          }, function (err, pushedRec){
            if (err) console.log(err);

            song.recommendations.push(pushedRec);
            song.save(function(err){
              console.log("errr: ", err)
              if (err) {
                res.json({error: "oh no! not saved", success: null})
              } else {
                res.json({error: null, success: "recommendations saved!"})
              }
            })
          }
        )
      }
    })
    } else {
      Song.create({
        title: req.body.currentTitle,
        artist: req.body.currentArtist,
        length: req.body.currentDuration,
        track_id: req.body.currentTrack,
        recommendations: []
      }, function(err, neworiginsong){
        if (err) console.log(err);
        Song.findOne({track_id: req.body.recTrackId}, function(err, recSong){
          console.log("Hello recSong: ", recSong);

          if (recSong) {
            neworiginsong.recommendations.push({song: recSong, upvotee: req.body.user});
            neworiginsong.save(function(err){
              console.log("errr: ", err)
              if (err) {
                res.json({error: "oh no! not saved", success: null})
              } else {
                res.json({error: null, success: "new recommendation saved with existing rec song in db!"})
              }
            })
          } else {
            Song.create({
              title: req.body.recTrackTitle,
              artist: req.body.recTrackArtist,
              length: req.body.recTrackDuration,
              track_id: req.body.recTrackId,
              recommendations: []
            }, function (err, pushedRec){
              if (err) console.log(err);

              neworiginsong.recommendations.push({song: pushedRec, upvotee: req.body.user});
              neworiginsong.save(function(err){
                console.log("errr: ", err)
                if (err) {
                  res.json({error: "oh no! not saved", success: null})
                } else {
                  res.json({error: null, success: "new song, new recommendations saved with new song in db!"})
                }
              })
            }
          )
        }
      })
    })
    }
  })
}

//TOP SONG FUNCTION GOES HERE

