var express = require('express'),
    indexrouter  = new express.Router();


//ANY ROUTES RELATING TO DATABASE GOES HERE//
//*******//

// Require controllers.
var mainController      = require('../controllers/main'),
    vursersController   = require('../controllers/vursers');


// root path:
indexrouter.get('/', mainController.index);

// users resource paths:
indexrouter.get('/users/:id', vursersController.show);


module.exports = indexrouter;
