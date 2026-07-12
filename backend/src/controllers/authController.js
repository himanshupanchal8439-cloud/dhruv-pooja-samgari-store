const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Otp = require('../models/Otp');
const sendEmail = require('../utils/sendEmail');

function signToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
}

function sendTokenCookie(res, token) {
  const isProd = process.env.NODE_ENV === 'production';
  res.cookie('token', token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

async function register(req, res, next) {
  try {
    const { name, email, password, phone } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    const user = await User.create({ name, email, password, phone });
    const token = signToken(user._id);
    sendTokenCookie(res, token);
    res.status(201).json({ id: user._id, name: user.name, email: user.email, role: user.role });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    if (user.isBlocked) return res.status(403).json({ message: 'Account blocked' });

    const token = signToken(user._id);
    sendTokenCookie(res, token);
    res.json({ id: user._id, name: user.name, email: user.email, role: user.role });
  } catch (err) {
    next(err);
  }
}

async function sendOtp(req, res, next) {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const user = await User.findOne({ email });
    if (user?.isBlocked) return res.status(403).json({ message: 'Account blocked' });

    const recent = await Otp.findOne({ email }).sort('-_id');
    if (recent && recent.expiresAt > new Date(Date.now() + 4 * 60 * 1000)) {
      return res.status(429).json({ message: 'Please wait a minute before requesting another code' });
    }

    const code = String(Math.floor(100000 + Math.random() * 900000));
    await Otp.deleteMany({ email });
    await Otp.create({ email, code, expiresAt: new Date(Date.now() + 5 * 60 * 1000) });

    await sendEmail({
      to: email,
      subject: 'Your Dhruv Pooja Samagri Store login code',
      html: `<p>Your one-time login code is:</p><h2 style="letter-spacing:4px">${code}</h2><p>This code expires in 5 minutes. If you didn't request this, you can ignore this email.</p>`,
    });

    res.json({ message: 'OTP sent' });
  } catch (err) {
    next(err);
  }
}

async function verifyOtp(req, res, next) {
  try {
    const { email, code, name } = req.body;
    if (!email || !code) return res.status(400).json({ message: 'Email and code are required' });

    const otp = await Otp.findOne({ email, code });
    if (!otp) return res.status(400).json({ message: 'Invalid or expired code' });
    if (otp.expiresAt < new Date()) {
      await otp.deleteOne();
      return res.status(400).json({ message: 'Code has expired' });
    }
    await otp.deleteOne();

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name: name || email.split('@')[0],
        email,
        password: crypto.randomBytes(16).toString('hex'),
      });
    }
    if (user.isBlocked) return res.status(403).json({ message: 'Account blocked' });

    const token = signToken(user._id);
    sendTokenCookie(res, token);
    res.json({ id: user._id, name: user.name, email: user.email, role: user.role });
  } catch (err) {
    next(err);
  }
}

function logout(req, res) {
  const isProd = process.env.NODE_ENV === 'production';
  res.clearCookie('token', { httpOnly: true, secure: isProd, sameSite: isProd ? 'none' : 'lax' });
  res.json({ message: 'Logged out' });
}

async function me(req, res) {
  res.json(req.user);
}

module.exports = { register, login, logout, me, sendOtp, verifyOtp };
