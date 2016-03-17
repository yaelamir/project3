var express = require('express'),
    indexrouter  = new express.Router();


//ANY ROUTES RELATING TO DATABASE GOES HERE//
//*******//

// Require controllers.
var mainController      = require('../controllers/main'),
    vursersController   = require('../controllers/vursers'),
    songsController     = require('../controllers/songs'),
    playlistsController = require('../controllers/playlists');


// root path:
indexrouter.get('/', mainController.index);

// users resource paths:
indexrouter.get('/users/me', vursersController.showCurrentUser);
indexrouter.get('/users/:id', vursersController.show);

// songs path:
indexrouter.get('/songs/:id', songsController.show);
indexrouter.post('/api/addrecs', songsController.addRecommendation);

// playlists path:
indexrouter.post('/playlists', playlistsController.addPlaylist);



module.exports = indexrouter;
