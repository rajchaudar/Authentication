const jwt = require('jsonwebtoken');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const bcrypt = require('bcryptjs');

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'User not found' });

    const issuedAt = Date.now();
    user.resetTokenIssuedAt = issuedAt;
    await user.save();

    const token = jwt.sign(
      { userId: user._id, issuedAt },
      process.env.JWT_VERIFY_SECRET,
      { expiresIn: '15m' }
    );

    const link = `${process.env.CLIENT_URL}/api/email/reset/${token}`;
    await sendEmail(email, 'Reset Password', `<a href="${link}">Reset Here</a>`);

    res.json({ msg: 'Password reset link sent!' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.resetPassword = async (req, res) => {
  const token = decodeURIComponent(req.params.token); 
  const { password } = req.body;

  if (!password) return res.status(400).json({ msg: 'Password is required' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_VERIFY_SECRET);

    const user = await User.findById(decoded.userId);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    res.json({ msg: 'Password reset successful' });
  } catch (err) {
    res.status(400).json({ msg: 'Invalid or expired token' });
  }
};