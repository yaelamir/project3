

SC.initialize({
  client_id: 'f4ddb16cc5099de27575f7bcb846636c'
});

SC.get('/tracks', {
  user: {username: "johnlegend"}
})
.then(function(tracks) {
  console.log(tracks);
});

