var Vurser = require("../models/Vurser");

module.exports = {
  show:  show
};


function show(req, res, next) {
  Vurser.findById(req.params.id, function(error, Vurser){
    if (error) res.json({message: 'Could not find Vurser because ' + error});
    res.render('Vursers/show', {Vurser: Vurser});
  });
};

