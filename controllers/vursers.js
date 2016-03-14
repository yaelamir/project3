
// Require resource's model(s).
var Vurser = require("../models/Vurser");

var index = function(req, res, next){

  Vurser.find({}, function(error, Vursers){
    res.render('users/index', {Vursers: Vursers});
  });
};

var show = function(req, res, next){
  Vurser.findById(req.params.id, function(error, Vurser){
    if (error) res.json({message: 'Could not find Vurser because ' + error});
    res.render('Vursers/show', {Vurser: Vurser});
  });
};

module.exports = {
  index: index,
  show:  show
};
