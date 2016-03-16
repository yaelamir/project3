console.log('JS loaded!');

var renderTrack,
    $search;

// Page load.
$(function() {
  $search = $('#search');

  // Compile track template.
  renderTrack = _.template(`
    <% tracks.forEach(function(track) { %>
      <span class="song-total" data-track-src="<%= track.stream_url %>?client_id=f4ddb16cc5099de27575f7bcb846636c">
        <button class="song-stream <%= track.id %>">Play</button>
          <img class="pic song-image" src="<%= track.user.avatar_url %>" style="max-width: 20px;">
          &nbsp&nbsp
          <%= track.title %>
      </span>
    <% }); %>
  `);

  // Add event handlers to page.
  $('form#searchbox').on('submit', showTracks);
  $('#searchResults').on('click', 'button', playSongs);
});

/*
 * SoundCloud API HELPER FUNCTIONS
 */

SC.initialize({
  client_id: 'f4ddb16cc5099de27575f7bcb846636c',
  redirect_uri: "http://localhost:3000/auth/soundcloud/callback"
});

console.log("SoundCloud SDK initialized.");

function getTracks(query) {
  return SC.get('/tracks', { q: query });
}

/*
 * AJAX / RENDER FUNCTIONS =============================================
 */

function showTracks(evt) {
  evt.preventDefault();

  getTracks($search.val())
    .then(function(tracks) {
      renderTracks(tracks);
    });
}

function renderTracks(tracks) {
  var $trackItem = $(renderTrack({tracks: tracks}));
  $('span.song-total').remove();
  $('img.song-image').remove();
  $('section#searchResults').append($trackItem);
}

/*
 * PAGE INTERACTIONS ===================================================
 */

function playSongs() {
  var $audio  = $('#audio-player');
  var playUri = $(this).parent().data('track-src');

  console.log(playUri);
  $audio.prepend(`<source src="${playUri}" type="audio/mpeg" />`);

  $audio[0].pause();
  $audio[0].load(); // suspends and restores all audio element
  $audio[0].play();
}
