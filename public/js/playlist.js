var renderTrack,
    renderRecs,
    renderPlist,
    renderAddPLSong,
    currentUser,
    $searchValue,
    $searchForm,
    $searchResults,
    $dashboard,
    $playboard;

// Page load.
$(function() {
  $searchValue   = $("#search-value");
  $searchForm    = $("#search-form");
  $searchResults = $("#search-results");
  $dashboard     = $("#dashboard");
  $playboard     = $("#playboard");

  // Compile templates
  renderTrack = _.template(`
    <% tracks.forEach(function(track) { %>
      <div class="song-total" data-track-src="<%= track.stream_url %>?client_id=f4ddb16cc5099de27575f7bcb846636c">
        <% if (action === "play") { %>
        <button data-track-id="<%= track.id %>" class="song-stream">Play</button>
        <% } else if (action === "both") { %>
        <button data-track-id="<%= track.id %>" class="song-stream">Play</button>
        <button data-track-id="<%= track.id %>" class="song-stream">+</button>
        <% } else { %>
        <button data-track-id="<%= track.id %>" class="song-stream">+</button>
        <% } %>
        <% if (track.artwork_url) { %>
          <img class="pic song-image" src="<%= track.artwork_url %>" style="max-width: 20px;">
        <% } else { %>
          <img class="pic song-image" src="<%= track.user.avatar_url %>" style="max-width: 20px;">
        <% } %>
          &nbsp&nbsp
          <%= track.title %>
      </div>
    <% }); %>
  `);

  renderRecs = _.template(`
    <div class="rec">
      <div>TRACK NAME</div><div>TRACK ARTIST</div>
      <button class="create-rec">RECOMMEND A SONG</button>
      <form id="search-rec" class="search-rec-form hidden">
        <input type="text" id="search-rec-value" placeholder="Search">
      </form>
      <ul class="found-recs hidden">
      </ul>
      <% recs.forEach(function(rec) { %>
        <div> RECOMMENDATION </div>
      <% }); %>
    </div>
  `);

  // Add event handlers to page.
  $searchForm.on('submit', showTracks);
  $('#playboard').on('click', '.play-playlist-song', playSong);
  $('#playboard').on('click', '#add-new-pl', addNewPlist);

  loadPlaylists();
});

/*
 * SoundCloud API HELPER FUNCTIONS =====================================
 */

SC.initialize({
  client_id:    "f4ddb16cc5099de27575f7bcb846636c",
  redirect_uri: "http://localhost:3000/auth/soundcloud/callback"
});

console.log("SoundCloud SDK initialized.");

function getTracks(query) {
  return SC.get('/tracks', { q: query });
}

/*
 * AJAX vurs API FUNCTIONS =============================================
 */

function fetchRecommendations(trackId) {
  // TODO: Implement fetch recommendations...
  return new Promise(function(resolve) { resolve([]); })
}

function createRecommendation(currentTrackId, recommendationTrackId) {
  // TODO: implement!
  console.log("IMPLEMENT ME", currentTrackId, recommendationTrackId);
}

/*
 * RENDER FUNCTIONS ====================================================
 */



// ----P-L-A-Y-L-I-S-T-S------------------------------------------------
//
// 1. See playlists ✔
// 2. See songs (API call) ✔
// 3. Play songs / See recommendations ✔
// 4. Add Song to Playlist from Recommendation View
// 5. Add Playlist / Push playlist to user
// 6. Edit playlist
//    - Rename playlist
//    - Delete song
//    - Delete playlist
//

renderPlist = _.template(`
  <% user.playlists.forEach(function(pl) { %>
    <li>
      <div class="collapsible-header" style="color: black;""><%= pl.title %></div>
      <% pl.songs.forEach(function(s) { %>
        <div class="collapsible-body" data-track-src="https://api.soundcloud.com/tracks/<%= s.track_id %>/stream?client_id=f4ddb16cc5099de27575f7bcb846636c">
          <button data-track-id="<%= s.track_id %>" class="play-playlist-song">&#9654;</button>
          <%= s.artist %> - <%= s.title %>
        </div>
      <% }); %>
      <div class="collapsible-body">
        <button class="addasong toggAdd">Add Song</button>
      </div>
    </li>
  <% }); %>
  <div class="collapsible-header">
    <button id="add-new-pl">Create New Playlist</button>
  </div>
`)

renderAddPLSong = _.template(`
  <div class="astp">
    <form id="search-song" class="search-song-form hidden">
      <input type="text" id="search-add-value">
    </form>
    <ul class="found-songs hidden">
    </ul>
  </div>
`)

function renderPlists(user) {
  $plylst = $(renderPlist({user: user}));

  $("#pl").empty().append($plylst);
}

function loadPlaylists() {
  $.ajax({
    method: "GET",
    url:    "/users/me"
  })
  .then(
    function(curUser) {
      currentUser = curUser;
      console.log(curUser);
      return curUser;
    },
    function(err) {
      console.log(err);
    }
  )
  .then(renderPlists);
}

function renderPossibleSongs($insert, tracks) {
  var $trackItem = $(renderTrack({tracks: tracks, action: "both"}));
  $trackItem.on('click', 'button', createRecommendation);

  $insert.empty().append($trackItem);
}

function addNewPlist() {
  var title = window.prompt("Enter Playlist Name");
  $.ajax({
    method: 'POST',
    url: "/playlists",
    data: { title: title }
  })
  .then(
    function(pl) {
      currentUser.playlists.push(pl);
      renderPlists(currentUser);
    });
}

// function addSongToPlist() {}




// ---------------------------------------------------------------------



function showTracks(evt) {
  evt.preventDefault();

  getTracks($searchValue.val())
    .then(function(tracks) {
      console.log("Tracks:", tracks);
      renderTracks(tracks);
    });
}

function showRecommendations(evt) {
  var trackId = $(evt.target).data("track-id");
  console.log("Show recommendations for: ", trackId);

  fetchRecommendations(trackId)
    .then(function(recommendations) {
      // render the recommendations to the screen
      renderRecommendations(recommendations);
    });
}

function renderTracks(tracks) {
  // Render the HTML.
  var $trackItem = $(renderTrack({tracks: tracks, action: "play"}));

  // Add listeners to the effected HTML.
  $trackItem.on('click', 'button', playSong);
  $trackItem.on('click', 'button', showRecommendations);

  // Clear search results and append new ones to page.
  $searchResults.empty().append($trackItem);
}

function renderPossibleRecs($insertion, tracks) {
  // Render the HTML.
  var $trackItem = $(renderTrack({tracks: tracks, action: "add"}));

  // Add listeners to the effected HTML.
  // $trackItem.on('click', 'button', playSong);
  $trackItem.on('click', 'button', createRecommendation);

  // Clear search results and append new ones to page.
  $insertion.empty().append($trackItem);
}

function renderRecommendations(recs) {
  console.log(recs);

  // Render the HTML.
  var recsHTML = renderRecs({recs: recs});

  // Add listeners to the effected HTML.
  var $recsHTML = $(recsHTML);
  var $recsSearchVal = $recsHTML.find("#search-rec-value");

  $recsHTML.find('.create-rec').on("click", function() {
    $recsHTML.find('.search-rec-form, .found-recs').toggleClass('hidden');
  });
  $recsHTML.find('.search-rec-form').on("submit", function(evt) {
    evt.preventDefault();
    getTracks($recsSearchVal.val()).then(function(tracks) {
      console.log("Rec tracks:", tracks);
      renderPossibleRecs($recsHTML.find(".found-recs"), tracks);
    });
  });

  // Append recs to page.
  $dashboard.find('.rec:last').remove();
  $dashboard.append($recsHTML);
}

/*
 * PAGE INTERACTIONS ===================================================
 */

var track;
 var volume = 1;


//start playing song when clicking play button
function playSong() {
  var $audio  = $('#audio-player');
  var playUri = $(this).closest('div').attr('data-track-src');
  track = new Audio(playUri);
  track.volume = 1;
  console.log('Playing track:', track, track.duration);
  track.play();
  track.addEventListener('canplaythrough', function(evt) {
    console.log(evt.target);
    console.log('duration:', track.duration);
    $('#total-time').text(secsToMin(track.duration));
    console.log('current time:', track.currentTime);
    track.addEventListener('timeupdate', function() {
      console.log('current time: ', this.currentTime);
      $('#time-left').text(secsToMin(track.currentTime));
    })
    // var currentSongTime = track.currentTime.change(secsToMin(track.currentTime));
    // var time = $('#time-left').attr('max', currentSongTime);
    // console.log(time);
  })

  // $audio.prepend(`<source src="${playUri}" type="audio/mpeg" />`);
  // , function() {
  //     $('#time-left').text()
  //   });
  // $audio[0].load(); // suspends and restores all audio element
  // $audio[0].pause();
  // $audio[0].play();
}

//converts seconds in floats to time
function secsToMin (seconds) {
  var mm = Math.floor(seconds / 60);
  var ss = seconds % 60;
  if (Math.round(ss) < 10) {
    ss = '0' + ss.toFixed(0);
  } else {
    ss = ss.toFixed(0)
  }
  return mm + ":" + ss;
}



 $('button.song-stream').on('click', playSong);

//toggle play and pause button
 $('#play').on('click', function() {
  if (track.paused === false) {
    console.log('song paused');
    track.pause();
    $('#play').text('play_arrow');
  } else if (track.paused === true) {
    console.log('song paused');
    $('#play').text('pause');
    track.play();
  }
})



//toggle volume when muted or not
 $('#volume').on('click', function() {
  if (volume === 1) {
    track.muted = true;
    volume = 0;
    $("#volume").text('volume_off');
    console.log('volume off');
  } else if (volume === 0) {
    track.muted = false;
    volume = 1;
    $("#volume").text('volume_up');
    console.log('volume on');
  // } else {
  //   (volume === false)
  //   track.muted = true;
  //   $("#volume").text('volume_up');
  //   console.log('volume on');
  }
  });

 //time remaining for song and duration
  $('#time-left').on('change', function() {
    console.log(track.currentTime);
    $('#time-left').attr(track.currentTime);
  })

 // $("#duration").on("change", function() {
 //        track.currentTime = $(this).val();
 //        $("#duration").attr("max", track.duration);
 //    });

 // duration



 // $('#prev').on('click', );
 // $('#next').on('click', );
 // $('#fav').on('click', );

// var playUri = $(this).parent().data('track-src');
// var songs = new Audio();
//   $('#play').on('click', function() {
//   })
