module.exports = function(app) {
	var checkins = require('../api/controllers/checkinsController');
  var users = require('../api/controllers/usersController.js');
  var checkinsWeb = require('../webControllers/checkinsWebController');
  var usersWeb = require('../webControllers/usersWebController');

	app.route('/api/checkins')
		.get(checkins.allCheckins)
    .post(users.loginRequired, checkins.createCheckin);

  app.route('/api/checkins/:checkinId')
		.get(checkins.readCheckin)
		.put(users.loginRequired, checkins.updateCheckin)
		.delete(users.loginRequired, checkins.deleteCheckin);

	app.route('/api/auth')
    .post(users.auth);

	app.route('/api/users')
    .get(users.allUsers)
		.post(users.createUser);

  app.route('/api/users/:userId')
    .get(users.readlUser)
		.put(users.loginRequired, users.updateUser)
    .delete(users.loginRequired, users.deleteUser);

  app.route('/')
    .get(checkinsWeb.indexPage);

  app.route('/users')
    .get(usersWeb.allUsers);

  app.route('/users/add')
    .get(usersWeb.addUserPage)
    .post(usersWeb.createUser);
};
