var Song = require("../models/Song");


module.exports = {
  show: show,
  addRecommendation: addRecommendation,
  fetchRecommendation: fetchRecommendation
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

          var foundRec = findRecommendedSongInRecommendedList(song, recSong);
          if (foundRec.length === 0) {
            addRecommendationToCurrSong(song, recSong, req.body.user, res);
          } else {
            upvoteRecommendation(foundRec);
            addRecommenderToUpvoteeList(req.body.user, foundRec);

            song.save(function(err){
              console.log("errr: ", err)
              if (err) {
                res.json({error: "oh no rec existed but couldnt do the thing! not saved", success: null})
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

//============================================================


function fetchRecommendation(req, res, next){
  // Find the current song
  var track_id = req.params.track_id;
  Song.findOne({track_id: track_id}, function(err, song){
    console.log("Pare, this is your CURRENT song: ", song);
    if (err) console.log(err);
    // If the song exists, find the recommended song
    if (song) {
      console.log("\nRECCSSSSS: ", song.recommendations)
      if (song.recommendations.length <= 0) song.recommendations = null;
      res.json({recommendations: song.recommendations});
      // Song.findOne({track_id: req.body.recTrack.track_id}, function(error, recSong){
      //   console.log("Pare, this is your RECOMMENDED song: ", recSong);
      //   // If it IS the recommended song...
      //   if (err) console.log(err);
      //   if (recSong){
      //     recSong.forEach(function(rec){
      //       recSong1 = req.body.recTrack.track_id;
      //       res.json({recSong1});
      //       console.log(recSong1);
      //     })
      //   }
      // })
    }
  })
}

//============================================================

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

function upvoteRecommendation(recSong) {
  recSong.upvotes += 1;
};

function addRecommenderToUpvoteeList(user, recSong) {
  var foundRecperson = recSong.upvotee.filter(function (recpersoninquestion) {
    return recpersoninquestion.toString() === user;
  });
  if (foundRecperson.length === 0) {
    recSong.upvotee.push(user);
  }
}

function findRecommendedSongInRecommendedList(currSong, recSong) {
  return currSong.recommendations.filter(function (recsonginquestion) {
    return recsonginquestion.song.toString() === recSong._id.toString();
  });
}
//TOP SONG FUNCTION GOES HERE

