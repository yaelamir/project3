var renderLi;
var $search = $('#search');

SC.initialize({
  client_id: 'f4ddb16cc5099de27575f7bcb846636c',
  redirect_uri: "http://localhost:3000/auth/soundcloud/callback"
});

function getTracks(query) {
  return SC.get('/tracks', { q: query });
}


function showTracks(evt) {
  evt.preventDefault();
  getTracks($search.val())
    .then(function(tracks) {

      renderTracks(tracks);
    });
}

function renderTracks(tracks) {
  var $trackItem = $(renderLi({tracks: tracks}));
  $('span#line1').remove();
  $('img#line3').remove();
  $('a#line2').remove();
  $('section#searchResults').append($trackItem);
}

          // &nbsp&nbsp
$(function() {
  renderLi = _.template(`
    <% tracks.forEach(function(track) { %>
      <span id="line1">
        <a id="line2" href="<%= track.stream_url %>?client_id=f4ddb16cc5099de27575f7bcb846636c">
          <img class="pic" id="line3" src="<%= track.user.avatar_url %>" style="max-width: 20px;">
          <%= track.title %>
        </a>
      </span>
    <% }); %>
  `)
  $('form#searchbox').on('submit', showTracks);
})
