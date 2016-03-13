var request = require('request');


request('https://soundcloud.com/connect', function (error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log(body) // Show the HTML for the homepage.
  }
})



// function searchUser(songs) {
//   request('http://soundcloud.com/connect/client_id=f4ddb16cc5099de27575f7bcb846636c', function(error, response, body) {
//     if(!error && response.statusCode === 200) {
//       console.log(songs);
//     }
//   })
// }


