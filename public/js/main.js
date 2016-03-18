console.log('JS loaded!');

const URL_PREFIX = "https://localhost:3000";

var renderTrack,
    renderRecs,
    renderPlist,
    renderAddPLSong,
    currentUser,
    $searchValue,
    $searchForm,
    $searchResults,
    $dashboard,
    $playboard,
    $mainboard;

// Page load.
$(function() {
  $searchValue   = $("#search-value");
  $searchForm    = $("#search-form");
  $searchResults = $("#search-results");
  $dashboard     = $("#dashboard");
  $playboard     = $("#playboard");
  $mainboard     = $("#mainboard");

  // Compile templates
  renderTrack = _.template(`
    <% tracks.forEach(function(track) { %>
      <div class="song-total" data-track-src="<%= track.stream_url %>?client_id=f4ddb16cc5099de27575f7bcb846636c">
        <% if (action === "play") { %>
        <button data-track-id="<%= track.id %>" data-title="<%= track.title %>" data-artist="<%= track.user.permalink %>" data-duration="<%= track.duration %>" data-image-src="<%= track.user.avatar_url %>" class="song-stream">Play</button>
        <% } else if (action === "both") { %>
        <button data-track-id="<%= track.id %>" data-title="<%= track.title %>" data-artist="<%= track.user.permalink %>" data-duration="<%= track.duration %>" data-image-src="<%= track.user.avatar_url %>" class="song-stream">Play</button>
        <button data-track-id="<%= track.id %>" data-title="<%= track.title %>" data-artist="<%= track.user.permalink %>" data-duration="<%= track.duration %>" data-image-src="<%= track.user.avatar_url %>" class="song-stream">+</button>
        <% } else { %>
        <button data-track-id="<%= track.id %>" data-title="<%= track.title %>" data-artist="<%= track.user.permalink %>" data-duration="<%= track.duration %>" data-image-src="<%= track.user.avatar_url %>" class="song-stream">+</button>
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
    <button id="add-rec-btn" class="create-rec">RECOMMEND A SONG</button>
    <form id="search-rec" class="search-rec-form hidden">
      <input type="text" id="search-rec-value" placeholder="Search">
    </form>
    <section id="recs-container">
    </section>
  `);

  renderRecs = _.template(`
    <div class="col m4 rec">
      <ul class=" z-depth-3 collection found-recs hidden">
      <% recs.forEach(function(rec) { %>
        <li class="collection-item transparent avatar"> RECOMMENDATION <img class="circle" src=""> <span class="title">Title</span></li>
        <div>RECSSSSS<%= rec.song %> <%= rec.upvotes %> </div>
      <% }); %>
      </ul>
    </div>
    `);

  // PLAYLISTS

  renderPlist = _.template(`
    <% user.playlists.forEach(function(pl) { %>
      <li>
        <div class="collapsible-header" style="color: black;""><%= pl.title %></div>
        <% if (pl.songs.length > 0) { %>
          <% pl.songs.forEach(function(s) { %>
            <div class="collapsible-body" data-track-src="https://api.soundcloud.com/tracks/<%= s.track_id %>/stream?client_id=f4ddb16cc5099de27575f7bcb846636c">
              <button data-track-id="<%= s.track_id %>" class="play-playlist-song">&#9654;</button>
              <%= s.artist %> - <%= s.title %>
            </div>
          <% }); %>
        <% } else { %>
          <div class="collapsible-body">No Songs Added Yet!</div>
        <% } %>
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

renderMainSongDiv = _.template(`

    <div class="col album-art">
      <img class="z-depth-3 circle" src="<%= song.image %>">
    </div>
    <div class="center-align artist-title">
      <span><%= song.title %><br>
      <%= song.artist %>
      </span>
    </div>

`)

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
  console.log('fetch', trackId)
  $.ajax({
    type: 'GET',
    url: '/api/recs/' + trackId,
  }).then(function(results){
    console.log('fetched results', results)
    return results;
  }).fail(function(error){
    console.log(error)
  })

  return new Promise(function(resolve) { resolve([results]); })
}

function createRecommendation(recommendationTrackId) {
  recommendationTrackId = recommendationTrackId.target.dataset
  var currentTrackId,
      currentTrackTitle,
      currentTrackArtist,
      currentTrackDuration;
      // console.log("TRACK SRC: ", track)
  // var audioSrc = document.getElementById('audio-player').children[0].src.split('/')
  var audioSrc = track.src.split('/')
  audioSrc.forEach(function(str){
    if(/^\d+$/.test(str)){
      currentTrackId = str;
    }
  })
  var currentTrackInfo = $("button[data-track-id=" + currentTrackId + "]");
  var currentTrackDataset = currentTrackInfo[0].dataset;
  // TODO: implement!
  console.log("IMPLEMENT ME", recommendationTrackId, "\nCURR: ", currentTrackDataset);
  var data = {
      recTrack: {
        title:    recommendationTrackId.title,
        artist:   recommendationTrackId.artist,
        length:   recommendationTrackId.duration,
        track_id: recommendationTrackId.trackId
      },
      currentTrack: {
        title:    currentTrackDataset.title,
        artist:   currentTrackDataset.artist,
        length:   currentTrackDataset.duration,
        track_id: currentTrackId
      },
      user: $('#userid').text()
    }
  $.ajax({
    type: 'POST',
    url: '/api/addrecs',
    data: data
  }).then(function(result){
    console.log(result)
  }).fail(function(error){
    console.log(error)
  })

}

function renderPlists(user) {
  $plylst = $(renderPlist({user: user}));

  $("#pl").empty().append($plylst);
}


function renderAddSearch(songs) {
  var addSearch = renderAddPLSong({songs: songs});
  var $addSearch = $(addSearch);

  var $addSearchVal = $addSearch.find("#search-add-value");

  $addSearch.find('.add-plsong').on("click", function() {
    $addSearch.find('.search-song-form, .found-songs').toggleClass('hidden');
  });

  $playboard.append($addSearch);
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

function editPlist() {

}

// END OF PLAYLISTS

function showTracks(evt) {
  evt.preventDefault();

  getTracks($searchValue.val())
    .then(function(tracks) {
      console.log("Tracks:", tracks);
      renderTracks(tracks);
            $('#modal1').openModal();

      $('#add-rec-btn').on("click", function() {
        $('.search-rec-form, .found-recs').toggleClass('hidden');
        // $searchResults.hide();
      });
      $('.search-rec-form').on("submit", function(evt) {
        evt.preventDefault();
        getTracks($('#search-rec-value').val()).then(function(tracks) {
          renderPossibleRecs($addSearch.find(".found-songs"), tracks);
        });
      });
    });

}


function renderTracks(tracks) {
  // Render the HTML.
  var $trackItem = $(renderTrack({tracks: tracks, action: "play"}));
  // Add listeners to the effected HTML.
  $trackItem.on('click', 'button', playSong);
  $trackItem.on('click', 'button', showSongInfo);

  // Clear search results and append new ones to page.
  $searchResults.empty().append($trackItem);
}

function showSongInfo(evt) {
  var thisSong = $(evt.target)
  var trackId = $(evt.target).data("track-id");
  console.log("Show recommendations for: ", trackId);
  var songInfo = {
    trackId: thisSong.data("track-id"),
    title: thisSong.data("title"),
    artist: thisSong.data("artist"),
    duration: thisSong.data("duration"),
    image: thisSong.data("image-src").replace("large.jpg", "t500x500.jpg")
  };
  console.log("here's your main song: ", songInfo)
  renderMainTrack(songInfo)

  fetchRecommendations(trackId)
    .then(function(recommendations) {
      // render the recommendations to the screen
      renderRecommendations(recommendations);
    });
}

function renderMainTrack(song) {
  var renderedSong = renderMainSongDiv({song: song});
  console.log("here's the rendered song: ", renderedSong);
  var $renderedSong = $(renderedSong);
  console.log("here's the jquery selected version: ", $renderedSong)

  $mainboard.empty().append($renderedSong)
}

function renderRecommendations(recs) {
  console.log(recs);

  // Render the HTML.
  var recsHTML = renderRecs({recs: recs});

  // Add listeners to the effected HTML.
  var $recsHTML = $(recsHTML);
  var $recsSearchVal = $recsHTML.find("#search-rec-value");


  $recsHTML.find('.search-rec-form').on("submit", function(evt) {
    evt.preventDefault();
    getTracks($recsSearchVal.val()).then(function(tracks) {
      console.log("Rec tracks:", tracks);


      // need to render possible recs into <section id="recs-container"> ?

      // renderPossibleRecs($recsHTML.find(".found-recs"), tracks);
    });
  });

  // Append recs to page.
  $dashboard.find('.rec:last').remove();
  $dashboard.append($recsHTML);
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


/*
 * MUSIC PLAYER ===================================================
 */



var track = new Audio();
var prevSongsPlayed = [];
var nextSongsPlayed = [];

//plays song triggers playSong function
$('button.song-stream').on('click', playSong);
//start playing song when click play button
function playSong(prev) {
  if (typeof prev === 'string') {
    track.src = prev;
  } else {
    track.src = $(this).closest('div').attr('data-track-src');
    prevSongsPlayed.push(track.src);
  }

  track.volume = 1;
  track.play();
  console.log('Playing track:', track);
  track.addEventListener('canplaythrough', function(evt) {
    console.log('evt.target', evt.target);
    console.log('duration:', track.duration);
    //displays total time of current song playing
    $('#total-time').text(secsToMin(track.duration));
    track.addEventListener('timeupdate', function() {
      $('#time-left').text(secsToMin(track.currentTime));
      //changes media bar to reflect current time of song playing
      $('#duration').val(track.currentTime / track.duration * 100);
    })
  })
}

//function to convert seconds to time
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

//toggle play and pause button on click
 $('#play').on('click', function() {
  if (track.paused === false) {
    console.log('song paused');
    track.pause();
    $('#play').text('play_arrow');
  } else if (track.paused === true) {
    console.log('song playing');
    $('#play').text('pause');
    track.play();
  }
});

//previous button - stores path of played songs
//and plays each previous song on click
$('#prev').on('click', function() {
  var song = prevSongsPlayed.pop();
  if (song) {
    nextSongsPlayed.push(track.src);
    playSong(song);
  }
});

//next button - plays stored path of previously
//played songs and skips through them on click
$('#next').on('click', function() {
  var song = nextSongsPlayed.pop();
  if (song) {
    prevSongsPlayed.push(track.src);
    playSong(song);
  }
});

//toggle volume icon when muted or not on click
var volume = 1;
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
 }
});

//time elapsed for currently playing song
$('#time-left').on('change', function() {
  console.log(track.currentTime);
  $('#time-left').attr(track.currentTime);
})







