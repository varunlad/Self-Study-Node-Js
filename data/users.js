
const bcrypt = require('bcrypt');

// Pre-hashed password for a known user
// For demo, we hash once on app startup
const users = [
  {
    id: 1,
    name: 'Demo User',
    email: 'demo@example.com',
    // we'll replace this with a hashed password at runtime
    password: null
  }
];
