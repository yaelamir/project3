module.exports = {
  index: index
};


function index(req, res, next) {
    res.render('welcome/index', { user: req.user });
};

