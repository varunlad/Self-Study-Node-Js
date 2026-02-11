const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false // do not return by default
    },
    // --- Password reset fields ---
    passwordResetToken: String,     // SHA-256 hash of the reset token
    passwordResetExpires: Date,     // expiry Date
    // Optional: track password changes
    passwordChangedAt: Date
  },
  { timestamps: true }
);

// Hash password before save if modified
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  // mark password change time to invalidate old JWTs if you want
  this.passwordChangedAt = new Date();
  next();
});

// Instance method to compare password
userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

// Return safe user object
userSchema.methods.toSafeObject = function () {
  return {
    id: this._id.toString(),
    name: this.name,
    email: this.email
  };
};

// Generate reset token (plain) and store its hash + expiry on user
userSchema.methods.createPasswordResetToken = function (ttlMs = 15 * 60 * 1000) {
  const resetToken = crypto.randomBytes(32).toString('hex'); // plain token
  const hashed = crypto.createHash('sha256').update(resetToken).digest('hex');

  this.passwordResetToken = hashed;
  this.passwordResetExpires = new Date(Date.now() + ttlMs);

  return resetToken; // return plain for emailing
};

// Optional: check if token was issued before password change
userSchema.methods.changedPasswordAfter = function (JWTTimestampSec) {
  if (!this.passwordChangedAt) return false;
  const changedTsSec = Math.floor(this.passwordChangedAt.getTime() / 1000);
  return changedTsSec > JWTTimestampSec; // true means password changed after JWT issued
};

const User = mongoose.model('User', userSchema);

module.exports = { User };