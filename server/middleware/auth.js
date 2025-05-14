const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('apollo-server-express');

// Middleware to verify JWT tokens
const authMiddleware = ({ req }) => {
  // Allows token to be sent via req.body, req.query, or headers
  let token = req.body.token || req.query.token || req.headers.authorization;

  // ["Bearer", "<tokenvalue>"]
  if (req.headers.authorization) {
    token = token.split(' ').pop().trim();
  }

  if (!token) {
    return { user: null };
  }

  try {
    const { data } = jwt.verify(token, process.env.JWT_SECRET);
    return { user: data };
  } catch (error) {
    console.log('Invalid token');
    // throw new AuthenticationError('Invalid or expired token');
  }
};

// Express middleware for protected routes
const isAuthenticated = (req, res, next) => {
  // Allows token to be sent via req.body, req.query, or headers
  let token = req.body.token || req.query.token || req.headers.authorization;

  // ["Bearer", "<tokenvalue>"]
  if (req.headers.authorization) {
    token = token.split(' ').pop().trim();
  }

  if (!token) {
    return res.status(401).json({ message: 'You need to be logged in!' });
  }

  try {
    const { data } = jwt.verify(token, process.env.JWT_SECRET);
    req.user = data;
    next();
  } catch (error) {
    console.log('Invalid token');
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = { authMiddleware, isAuthenticated };