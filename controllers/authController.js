const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const { generateTokens } = require('../utils/tokenGenerator');

exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ username, email, password: hashedPassword });
    await user.save();

    const verifyToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_VERIFY_SECRET,
      { expiresIn: '15m' }
    );
    const verifyLink = `${process.env.CLIENT_URL}/api/auth/verify/${verifyToken}`;

    await sendEmail(email, 'Verify your email', `<a href="${verifyLink}">Verify</a>`);
    res.status(201).json({ msg: 'Registration successful. Please verify your email.' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const decoded = jwt.verify(req.params.token, process.env.JWT_VERIFY_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(400).json({ msg: 'User not found' });
    if (user.isVerified) return res.status(400).json({ msg: 'Already verified' });
    user.isVerified = true;
    await user.save();
    res.json({ msg: 'Email verified successfully!' });
  } catch (err) {
    res.status(400).json({ msg: 'Invalid or expired token' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });
    if (!user.isVerified) return res.status(401).json({ msg: 'Please verify your email' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const tokens = generateTokens(user._id);

    res.json(tokens); // { accessToken, refreshToken }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.refreshAccessToken = (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) return res.status(401).json({ msg: 'No refresh token provided' });

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const accessToken = jwt.sign({ userId: decoded.userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });

    res.json({ accessToken });
  }  catch (err) {
  if (err.name === 'TokenExpiredError') {
    return res.status(400).json({ msg: 'Verification link expired' });
  }
  return res.status(400).json({ msg: 'Invalid verification token' });
  }
};
