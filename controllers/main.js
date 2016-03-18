require('dotenv').load();

module.exports = {
  index: index
};

function index(req, res, next) {
    // res.render('main/index', { user: req.user });
    res.render('main/masterview', {
      user: req.user,
      hostname: process.env.HOST,
      clientId: process.env.SOUNDCLOUD_CLIENT_ID
    });
};

