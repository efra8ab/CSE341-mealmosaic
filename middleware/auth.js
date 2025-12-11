const authBypassEnabled = () => process.env.AUTH_BYPASS === 'true';

const requireAuth = (req, res, next) => {
  if (authBypassEnabled()) {
    return next();
  }

  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }

  return res.status(401).json({ message: 'Authentication required. Please log in with GitHub.' });
};

module.exports = { requireAuth, authBypassEnabled };
