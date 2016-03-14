// var song = {
//   query: $('input#search').val()
// }

SC.initialize({
  client_id: 'f4ddb16cc5099de27575f7bcb846636c',
  redirect_uri: "http://localhost:3000/auth/soundcloud/callback"
});

// var renderLi;
//displays tracks with titles
//As a user, I would like to be able to search for songs
function getTracks() {
  SC.get('/tracks', {
  q: $('input#search').val()
  }, function(tracks) {
    tracks.forEach(function(track) {
      showTracks(track);
    });
  })
}

$(document).ready(function() {
  //SC.get('/tracks', { genres: 'foo' }, function(tracks) {
  //  $(tracks).each(function(index, track) {
  //    $('#results').append($('<li></li>').html(track.title + ' - ' + track.genre));
  //  });
  //});
});

function showTracks(track) {
  var $trackItem = $(renderLi(track));
  $('ul#searchResults').append($trackItem);
  console.log($trackItem)
}

$(function() {
  renderLi = _.template(`
    <li><%= title %></li>
  `)

  $('form#search-box').on('submit', getTracks);
})

// displays users name
// AAU I'd like to be able to search for an artist so that I can see the song that they've uploaded
// SC.get('/users', {
//   // user: {username: "johnlegend"}
//   q: 'justin bieber'
// })
// .then(function(tracks) {
//   tracks.forEach(function(q) {
//     // console.log(q.title);
//     console.log("fullname: ", q.full_name);
//   })
// });

