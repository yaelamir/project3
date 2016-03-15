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
  $('span#line').remove();
  $('section#searchResults').append($trackItem);
}

$(function() {
  renderLi = _.template(`
    <% tracks.forEach(function(track) { %>
      <span id="line">
        <a id="line" href="<%= track.stream_url %>?client_id=f4ddb16cc5099de27575f7bcb846636c">
          <img class="pic" id="line" src="<%= track.user.avatar_url %>" style="max-width: 20px;">
          &nbsp&nbsp
          <%= track.title %>
        </a>
      </span>
      <br>
    <% }); %>
  `)
  $('form#searchbox').on('submit', showTracks);
})
