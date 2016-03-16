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
  //Find the currently playing song
  Song.findOne({track_id: req.body.currentTrack.track_id}, function(error, song){
    console.log("Hey again: ", song);
    //If song exists in the db.
    if (song) {
      //Find the recommended song in the database
      Song.findOne({track_id: req.body.recTrack.track_id}, function(err, recSong){
        console.log("Hello recSong: ", recSong);
        //If that recommended song exists,
        if (recSong) {

          var foundRec = song.recommendations.filter(function (recsonginquestion) {
            return recsonginquestion.song.toString() === recSong._id.toString();
            console.log("the song in question: ", recsonginquestion, "the actual song _id: ", recsonginquestion.song, "is this true?: should be.... ", (recsonginquestion.song).toString() === recSong._id.toString())
          });
          if (foundRec.length === 0) {
            console.log("making new rec: ", foundRec, foundRec.length)
            addRecommendationToCurrSong(song, recSong, req.body.user, res);
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
          Song.create(req.body.recTrack, function (err, pushedRec){
            if (err) console.log(err);
            addRecommendationToCurrSong(song, pushedRec, req.body.user, res);
          }
        )
      }
    })
    //IF curently playing song does not exist, create new entry in db
    } else {
      Song.create(req.body.currentTrack, function(err, neworiginsong){
        if (err) console.log(err);
        Song.findOne({track_id: req.body.recTrack.track_id}, function(err, recSong){
          console.log("Hello recSong: ", recSong);

          if (recSong) {
            addRecommendationToCurrSong(neworiginsong, recSong, req.body.user, res);
          } else {
            Song.create(req.body.recTrack, function (err, pushedRec){
              if (err) console.log(err);
              addRecommendationToCurrSong(neworiginsong, pushedRec, req.body.user, res);
            }
          )
        }
      })
    })
    }
  })
}

function addRecommendationToCurrSong(currSong, recSong, user, res) {
  currSong.recommendations.push({song: recSong, upvotee: user});
  currSong.save(function(err){
    console.log("errr: ", err)
    if (err) {
      res.json({error: "oh no! not saved", success: null})
    } else {
      res.json({error: null, success: "new song, new recommendations saved with new song in db!"})
    }
  });
}

//TOP SONG FUNCTION GOES HERE

