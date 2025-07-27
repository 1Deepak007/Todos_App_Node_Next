const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');

    if (!token) 
      return res.status(401).json({ success: false, message: 'Unauthorized: No token provided, please login.' });
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) 
      return res.status(401).json({ success: false, message: 'Unauthorized: User not found.' });
    
    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Unauthorized: Invalid or expired token.' });
  }
};
