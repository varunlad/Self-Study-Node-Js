// controllers/user.controller.js
const { User } = require('../models/User');

async function me(req, res) {
  try {
    const dbUser = await User.findById(req.user.sub);
    if (!dbUser) {
      return res.status(404).json({ error: 'User not found.' });
    }

    return res.json({
      message: 'Profile fetched.',
      user: dbUser.toSafeObject(),
    });
  } catch (err) {
    console.error('Me error:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}

module.exports = { me };