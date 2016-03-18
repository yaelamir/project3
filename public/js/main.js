console.log('JS loaded!');


const URL_PREFIX = "https://mysterious-garden-27618.herokuapp.com/";
// const URL_PREFIX = "https://localhost:3000";
/*
 * SoundCloud API HELPER FUNCTIONS =====================================
 */

console.log("SoundCloud SDK initialized.");

function getTracks(query) {
  return SC.get('/tracks', { q: query });
}

/*
 * =====================================================================
 */


var renderTrack,
    renderRecs,
    renderPlist,
    renderAddPLSong,
    renderMainSongDiv,
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
  $newPlForm    = $("#new-pl-form");

/* Compile templates
 *======================================================================
 */
  renderTrack = _.template(`
    <% tracks.forEach(function(track) { %>
      <div class="song-total" data-track-src="<%= track.stream_url %>?client_id=<%=clientId%>">
        <% if (action === "play") { %>
          <i data-track-id="<%= track.id %>" data-title="<%= track.title %>" data-artist="<%= track.user.username %>" data-duration="<%= track.duration %>" data-image-src="<%= track.artwork_url %>" class="song-stream material-icons">play_arrow</i>
        <% } else { %>
          <i data-track-id="<%= track.id %>" data-title="<%= track.title %>" data-artist="<%= track.user.username %>" data-duration="<%= track.duration %>" data-image-src="<%= track.artwork_url %>" class="song-stream material-icons">queue</i>
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
    <i id="add-rec-btn" class="col s12 create-rec">RECOMMEND A SONG</i>
    <div class="col s12 rec z-depth-3">
      <% if (recs) { %>
        <% recs.forEach(function(rec) { %>
          <div class="collection-item transparent avatar"></div>
          <div><%= rec.song.title %>    |    <%= rec.song.artist %>   |    <strong><%= rec.upvotes %></strong> <i data-track-src="https://api.soundcloud.com/tracks/<%= rec.song.track_id %>/stream?client_id=f4ddb16cc5099de27575f7bcb846636c" data-track-id="<%= rec.song.track_id %>"  data-title="<%= rec.song.title %>" data-artist="<%= rec.song.artist %>" data-duration="<%= rec.song.length %>" class="song-stream-rec material-icons">play_arrow</i>
          <i data-track-id="<%= rec.song.track_id %>" data-sc-id="<%= rec.song.track_id %>data-title="<%= rec.song.title %>" data-artist="<%= rec.song.artist %>" data-duration="<%= rec.song.length %>" class="song-upvote material-icons">queue</i></div>
        <% }); %>
      <% } %>
    </div>`
  );


renderPlist = _.template(`
  <% user.playlists.forEach(function(pl) { %>
    <li>
      <div data-pl="<%= pl._id %>" class="collapsible-header plhead">
        <%= pl.title %>
        <i data-target="editplmodal" class="material-icons modal-trigger right">mode_edit</i>
      </div>
      <% if (pl.songs.length > 0) { %>
        <% pl.songs.forEach(function(s) { %>
          <div class="collapsible-body" data-track-src="https://api.soundcloud.com/tracks/<%= s.track_id %>/stream?client_id=f4ddb16cc5099de27575f7bcb846636c">
            <i data-track-id="<%= s.track_id %>" class="play-playlist-song">&#9654;</i>
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


renderMainSongDiv = _.template(`
    <div class="col album-art">
      <img data-track-id=" <%= song.trackId %>" class="z-depth-3 circle" src="<%= song.image %>">
    </div>
    <div class="center-align artist-title">
      <span><%= song.title %><br>
      <%= song.artist %>
      </span>
    </div>

`)

  // Add event handlers to page.
  $searchForm.on('submit', showTracks);
  $newPlForm.on('submit', addNewPlist);
  $('#playboard').on('click', '.play-playlist-song', playSong);
  $('#playboard').on('click', '#add-new-pl', openNewPlModal);
  $('#playboard').on('click', 'i', editPlaylist);
  $('#playboard').on('click', 'i', getPlInfo);



  loadPlaylists();
});


/*
 * AJAX vurs API FUNCTIONS =============================================
 */

SC.initialize({
  client_id:  clientId,
  redirect_uri: "http://" + hostname + "/auth/soundcloud/callback"
});

 function showTracks(evt) {
  evt.preventDefault();
  getTracks($searchValue.val())
    .then(function(tracks) {
      console.log("Tracks:", tracks);
      renderTracks(tracks);
      $('#modal1').openModal();
      $('.search-rec-form').hide();

      // $('#add-rec-btn').on("click", function() {
      //   $('.search-rec-form, .found-recs').toggleClass('hidden');
      //   $('#modal1').openModal();
      //   // $searchResults.hide();;
    });
}

function renderPossibleRecs($insertion, tracks) {
  // Render the HTML.
  var $trackItem = $(renderTrack({tracks: tracks, action: "add", modal: "recs"}));

  // Add listeners to the effected HTML.
  // $trackItem.on('click', 'i', playSong);
  $trackItem.on('click', 'i', createRecommendation);

  // Clear search results and append new ones to page.
  $insertion.find('i').not($('[data-track-id=' + $('#mainboard div img').data('track-id') + ']')).closest('div').remove()
  $insertion.append($trackItem);
}

function renderTracks(tracks) {
  // Render the HTML.
  var $trackItem = $(renderTrack({tracks: tracks, action: "play", modal: "search"}));
  // Add listeners to the effected HTML.
  $trackItem.on('click', 'i', playSong);
  $trackItem.on('click', 'i', showSongInfo);

  // Clear search results and append new ones to page.
  $searchResults.empty().append($trackItem);
  $('#modal-title').empty().append("<h4>Search Results</h4>");
}

function showSongInfo(evt) {
  var thisSong = $(evt.target)
  var trackId = $(evt.target).data("track-id");
  var songInfo = {
    trackId: thisSong.data("track-id"),
    title: thisSong.data("title"),
    artist: thisSong.data("artist"),
    duration: thisSong.data("duration"),
    image: thisSong.data("image-src").replace("large.jpg", "t500x500.jpg")
  };
  renderMainTrack(songInfo)

  $('#modal1').closeModal();
  fetchRecommendations(trackId);
}

function renderMainTrack(song) {
  var renderedSong = renderMainSongDiv({song: song});
  var $renderedSong = $(renderedSong);
  $mainboard.empty().append($renderedSong)
}


function fetchRecommendations(trackId) {
  var x;
  $.ajax({
    type: 'GET',
    url: '/api/recs/' + trackId,
  }).then(function(results){
    renderRecommendations(results.recommendations);
  }).fail(function(error){
  })
}

function renderRecommendations(recs) {
  var recsHTML = renderRecs({recs: recs});
  var $recsHTML = $(recsHTML);
  var $recsSearchVal = $recsHTML.find("#search-rec-value");


  $recsHTML.find('.search-rec-form').on("submit", function(evt) {
    evt.preventDefault();
    getTracks($recsSearchVal.val()).then(function(tracks) {
      $dashboard.append($recsHTML);
    });
  });

  $dashboard.find('.rec:last').remove();
  $dashboard.empty().append($recsHTML);

   $('#add-rec-btn').on("click", function() {
        $('.search-rec-form').show();
        $('#modal1').openModal();
          $('#modal-title').empty().append("<h4>Search a Recommendation</h4>");

        // $searchResults.hide();
      });
   $('i.song-stream-rec').on('click', playSong);
   $('i.song-upvote').on('click', createRecommendation);

   $('.search-rec-form').on("submit", function(evt) {
        evt.preventDefault();
        getTracks($('#search-rec-value').val()).then(function(tracks) {
          renderPossibleRecs($searchResults, tracks)
          $('#modal-title').empty().append("<h4>Search a Recommendation</h4>");

        });
      })
}

function createRecommendation(recommendationTrackId) {
  recommendationTrackId = recommendationTrackId.target.dataset
  var currentTrackId,
      currentTrackTitle,
      currentTrackArtist,
      currentTrackDuration;
  var audioSrc = track.src.split('/')
  audioSrc.forEach(function(str){
    if(/^\d+$/.test(str)){
      currentTrackId = str;
    }
  })
  var currentTrackInfo = $("i[data-track-id=" + currentTrackId + "]");
  var currentTrackDataset = currentTrackInfo[0].dataset;
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
    fetchRecommendations(currentTrackId);
  }).fail(function(error){
  })

}

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
      return curUser;
    },
    function(err) {
      console.log(err);
    }
  )
  .then(renderPlists);
}

function openNewPlModal() {
  $('#newplmodal').openModal();
}

function addNewPlist() {
  $.ajax({
    method: 'POST',
    url: "/playlists",
    data: { title: $('input#new-pl-title').val() }
  })
  .then(
    function(pl) {
      currentUser.playlists.push(pl);
      renderPlists(currentUser);
    });
  $('#newplmodal').closeModal();
}

function editPlaylist() {
  $('#editplmodal').openModal();
}

function editPlTit() {
  // access with jquery the id, title and all song ids & titles

  // use the above data to dynamically add


  // after plugging in data, show the "div"
  $('#pl-title').show();

  $('#pl-title').on('blur', function() {
    // make ajax call to update title
    $.ajax({
      method: "PUT",
      url: '/playlists/' + "playlist id from somewhere" + "/updatetitle",
      data: {
        title: $('#pl-title').val()
      }
    }, function(data) {
      // update dom inside of My Playlists
    });
  });

  $('#close-pl-btn').on('click', function() {
    $('#pl-title').show();
  });
}

function getPlInfo(evt) {
  var thisPl = $(evt.target);
  var plId = $(evt.target).closest('.plhead').data('pl');
  console.log(plId);
}

/*
 * MUSIC PLAYER ===================================================
 */



var track = new Audio();
var prevSongsPlayed = [];
var nextSongsPlayed = [];

//start playing song when clicking play i

function playSong(prev) {
  if (typeof prev === 'string') {
    track.src = prev;
  } else {
    track.src = $(this).closest('div').attr('data-track-src') ? $(this).closest('div').attr('data-track-src') : $(this).closest('i').attr('data-track-src');
    prevSongsPlayed.push(track.src);
  }

  // track = new Audio(playUri);
  track.volume = 1;
  track.play();
  track.addEventListener('canplaythrough', function(evt) {
    $('#total-time').text(secsToMin(track.duration));
    track.addEventListener('timeupdate', function() {
      $('#time-left').text(secsToMin(track.currentTime));
      $('#duration').val(track.currentTime / track.duration * 100);
    })
  })
}

//converts seconds in float to time
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

//toggle play and pause i
 $('#play').on('click', function() {
  if (track.paused === false) {
    track.pause();
    $('#play').text('play_arrow');
  } else if (track.paused === true) {
    $('#play').text('pause');
    track.play();
  }
});

$('#prev').on('click', function() {
  var song = prevSongsPlayed.pop();
  if (song) {
    nextSongsPlayed.push(track.src);
    playSong(song);
  }
});

$('#next').on('click', function() {
  var song = nextSongsPlayed.pop();
  if (song) {
    prevSongsPlayed.push(track.src);
    playSong(song);
  }
});


var volume = 1;
//toggle volume when muted or not
 $('#volume').on('click', function() {
  if (volume === 1) {
    track.muted = true;
    volume = 0;
    $("#volume").text('volume_off');
  } else if (volume === 0) {
    track.muted = false;
    volume = 1;
    $("#volume").text('volume_up');
  }
  });

 //time remaining for song and duration
  $('#time-left').on('change', function() {
    $('#time-left').attr(track.currentTime);
  })









