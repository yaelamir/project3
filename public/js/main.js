console.log('JS loaded!');

var renderTrack,
    renderRecs,
    $searchValue,
    $searchForm,
    $searchResults,
    $dashboard;

// Page load.
$(function() {
  $searchValue   = $("#search-value");
  $searchForm    = $("#search-form");
  $searchResults = $("#search-results");
  $dashboard     = $("#dashboard");

  // Compile templates
  renderTrack = _.template(`
    <% tracks.forEach(function(track) { %>
      <span class="song-total" data-track-src="<%= track.stream_url %>?client_id=f4ddb16cc5099de27575f7bcb846636c">
        <% if (action === "play") { %>
        <button data-track-id="<%= track.id %>" class="song-stream">Play</button>
        <% } else { %>
        <button data-track-id="<%= track.id %>" class="song-stream">+</button>
        <% } %>
          <img class="pic song-image" src="<%= track.user.avatar_url %>" style="max-width: 20px;">
          &nbsp&nbsp
          <%= track.title %>
      </span>
    <% }); %>
  `);

  renderRecs = _.template(`
    <div class="col m4 rec">
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
    </div>`
  );

  // Add event handlers to page.
  $searchForm.on('submit', showTracks);
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

function playSong() {
  var $audio  = $('#audio-player');
  var playUri = $(this).parent().data('track-src');

  console.log("Play track:", playUri);
  $audio.prepend(`<source src="${playUri}" type="audio/mpeg" />`);

  $audio[0].pause();
  $audio[0].load(); // suspends and restores all audio element
  $audio[0].play();
}
