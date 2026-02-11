// server.js
const path = require('path');
const express = require('express');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '.env') });

const { connectDB } = require('./db/mongoose');

// Mountable route modules
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');

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
  res.json({ status: 'OK', message: 'Express + JWT + MongoDB API (MVC) running' });
});

// Mount routes
app.use('/auth', authRoutes); // /auth/register, /auth/login, /auth/change-password
app.use('/', userRoutes);     // /me

// --- Connect DB, then start server ---
(async () => {
  try {
    await connectDB(); // uses process.env.MONGODB_URI
    app.listen(PORT, () => {
      console.log(`✓ Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start:', err);
    process.exit(1);
  }
})();