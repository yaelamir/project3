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
  $('span.line1').remove();
  $('img.line3').remove();
  $('a.line2').remove();
  $('section#searchResults').append($trackItem);
}

          // &nbsp&nbsp
$(function() {
  renderLi = _.template(`
    <% tracks.forEach(function(track) { %>
      <span class="line1">
        <a class="line2" href="<%= track.stream_url %>?client_id=f4ddb16cc5099de27575f7bcb846636c">
          <img class="pic line3" src="<%= track.user.avatar_url %>" style="max-width: 20px;">
          <%= track.title %>
        </a>
      </span>
    <% }); %>
  `)
  $('form#searchbox').on('submit', showTracks);
})

$(function() {
  renderLi = _.template(`
    <% tracks.forEach(function(track) { %>
      <span class="song-total" title="<%= track.stream_url %>?client_id=f4ddb16cc5099de27575f7bcb846636c">
        <button class="song-stream <%= track.id %>">Play</button>
          <img class="pic song-image" src="<%= track.user.avatar_url %>" style="max-width: 20px;">
          &nbsp&nbsp
          <%= track.title %>
      </span>
    <% }); %>
  `)
  $('form#searchbox').on('submit', showTracks);
})


// SC.stream('/tracks/293').then(function(player){
//   player.play();
// });

// SC.stream("/tracks/293", function(sound){
//     $("audio-player").attr("src", sound.uri);
// });


function playSongs() {
    var $audio = $('#audio-player');
    var playUri = $(this).parent().attr('title');
    console.log(playUri)
    // SC.get("/tracks/" + sourceUrl + "/stream", {}, function(sound){
    //   allow_redirects=False;
    //   alert("Sound URI: " + sound.uri);
    //   console.log(sound)

    $audio.prepend(`<source src="${playUri}" type="audio/mpeg" />`);
    // });

    /****************/
    // audio[0].pause();
    // audio[0].load();//suspends and restores all audio element
    $audio[0].play(); //changed based on Sprachprofi's comment below
    /****************/
}

$('#searchResults').on('click', 'button', playSongs);




