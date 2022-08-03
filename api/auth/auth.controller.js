const authService = require('./auth.service');

module.exports = {
  login,
  signup,
  logout,
};

async function login(req, res) {
  const { username, password } = req.body;
  try {
    const user = await authService.login(username, password);
    req.session.user = user;
    res.json(user);
  } catch (err) {
    console.error('Failed to Login ' + err);
    res.status(401).send({ err: 'Failed to Login' });
  }
}

async function signup(req, res) {
  try {
    const { username, password, fullname } = req.body;
    await authService.signup(username, password, fullname);
    const user = await authService.login(username, password);
    req.session.user = user;
    res.json(user);
  } catch (err) {
    console.error('Failed to signup ' + err);
    res.status(500).send({ err: 'Failed to signup' });
  }
}

async function logout(req, res) {
  try {
    req.session.destroy();
    res.send({ msg: 'Logged out successfully' });
  } catch (err) {
    res.status(500).send({ err: 'Failed to logout' });
  }
}
