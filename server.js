// server.js
const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

const { connectDB } = require('./db/mongoose');
const { authRequired } = require('./middleware/auth');
const { User } = require('./models/User');
// --- Load .env explicitly from project root (Windows-safe) ---
dotenv.config({ path: path.join(__dirname, '.env') });

// --- Fail fast on critical misconfig ---
if (!process.env.MONGODB_URI) {
  console.error('❌ MONGODB_URI is missing. Set it in .env (one line, no quotes).');
  process.exit(1);
}
if (!process.env.JWT_SECRET) {
  console.error('❌ JWT_SECRET is missing. Set it in .env.');
  process.exit(1);
}

const app = express();
app.use(express.json()); // parse JSON

const PORT = process.env.PORT || 3000;

// Health
app.get('/', (req, res) => {
  res.json({ status: 'OK', message: 'Express + JWT + MongoDB API running' });
});

/**
 * POST /auth/register
 * Body: { name, email, password }
 */
app.post('/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'name, email, password are required.' });
    }

    // Check existing
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ error: 'Email already registered.' });
    }

    // Create user (password hashes in pre-save hook)
    const user = new User({ name, email, password });
    await user.save();

    return res.status(201).json({
      message: 'User registered',
      user: user.toSafeObject(),
    });
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(409).json({ error: 'Email already registered.' });
    }
    console.error('Register error:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

/**
 * POST /auth/login
 * Body: { email, password }
 * Returns: { token, user }
 */
app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: 'email and password are required.' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      { sub: user._id.toString(), email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );

    const safeUser = user.toSafeObject();

    return res.json({ token, user: safeUser });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

/**
 * GET /me (protected)
 * Header: Authorization: Bearer <token>
 */
app.get('/me', authRequired, async (req, res) => {
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
});

// --- Connect DB, then start server ---
(async () => {
  try {
    await connectDB(); // uses process.env.MONGODB_URI
    app.listen(PORT, () => {
      console.log(`✓ Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start:', err);
    // Helpful hint for common Atlas auth issue
    if (
      String(err?.message || '').toLowerCase().includes('auth') ||
      String(err?.codeName || '').toLowerCase().includes('atlaserror')
    ) {
      console.error(
        '\nTroubleshooting tips:\n' +
          '1) Reset your Atlas Database User password (Security → Database Access) and update .env.\n' +
          '2) If your password has @ ? # & % etc., URL-encode it and put that in MONGODB_URI.\n' +
          '   Example: node -e "console.log(encodeURIComponent(\'RawP@ss?2026#X\'))"\n' +
          '3) Optionally append &authSource=admin to your URI.\n' +
          '4) Ensure your .env MONGODB_URI is a single line, no quotes.\n'
      );
    }
    process.exit(1);
  }
})();
``