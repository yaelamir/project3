var express = require('express'),
    router  = new express.Router();

// Require controllers.
var welcomeController = require('../controllers/welcome');
var vursersController   = require('../controllers/vursers');

// root path:
router.get('/', welcomeController.index);

// users resource paths:
router.get('/users',     vursersController.index);
router.get('/users/:id', vursersController.show);

module.exports = router;
