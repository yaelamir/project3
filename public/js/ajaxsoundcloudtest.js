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
  $('li#line').remove();
  $('ul#searchResults').append($trackItem);
}

$(function() {
  renderLi = _.template(`
    <% tracks.forEach(function(track) { %>
      <li id="line"><%= track.title %></li>
    <% }); %>
  `)
  $('form#searchbox').on('submit', showTracks);
})
