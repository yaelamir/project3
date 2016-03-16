module.exports = {
  index: index
};

function index(req, res, next) {
    res.render('main/masterview', { user: req.user });
    res.render('main/index', { user: req.user });
};

