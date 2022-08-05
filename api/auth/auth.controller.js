const authService = require('./auth.service');
const utilService = require('../../services/util.service');

module.exports = {
  login,
  signup,
  logout,
};

async function login(req, res) {
  let { username, password } = req.body;
  const secureUsername = utilService.secureStr(username);
  const securePassword = utilService.secureStr(password);

  try {
    const user = await authService.login(secureUsername, securePassword);
    req.session.user = user;
    res.json(user);
  } catch (err) {
    console.error('Failed to Login ' + err);
    res.status(401).send({ err: 'Failed to Login' });
  }
}

async function signup(req, res) {
  const { username, password, fullname } = req.body;
  const secureUsername = utilService.secureStr(username);
  const securePassword = utilService.secureStr(password);
  const secureFullname = utilService.secureStr(fullname);
  try {
    await authService.signup(secureUsername, securePassword, secureFullname);
    const user = await authService.login(secureUsername, securePassword);
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
