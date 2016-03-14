var express = require('express'),
    indexrouter  = new express.Router();


//ANY ROUTES RELATING TO DATABASE GOES HERE//
//*******//

// Require controllers.
var welcomeController = require('../controllers/welcome');
var vursersController   = require('../controllers/vursers');


// root path:
indexrouter.get('/', welcomeController.index);

// users resource paths:
indexrouter.get('/users',     vursersController.index);
indexrouter.get('/users/:id', vursersController.show);


module.exports = indexrouter;
