const express = require('express');
const { isOAuthConfigured } = require('../middleware/passport');

const buildAuthRouter = (passport) => {
  const router = express.Router();

  router.get(
    '/github',
    /* 
      #swagger.tags = ['Auth']
      #swagger.summary = 'Start GitHub OAuth login'
    */
    (req, res, next) => {
      if (!isOAuthConfigured()) {
        return res
          .status(503)
          .json({ message: 'GitHub OAuth is not configured. Set GITHUB_CLIENT_ID/SECRET/CALLBACK_URL.' });
      }

      return passport.authenticate('github', { scope: ['read:user', 'user:email'] })(req, res, next);
    }
  );

  router.get(
    '/github/callback',
    /* 
      #swagger.tags = ['Auth']
      #swagger.summary = 'GitHub OAuth callback'
    */
    (req, res, next) => {
      if (!isOAuthConfigured()) {
        return res
          .status(503)
          .json({ message: 'GitHub OAuth is not configured. Set GITHUB_CLIENT_ID/SECRET/CALLBACK_URL.' });
      }

      return passport.authenticate('github', { failureRedirect: '/auth/failure' })(req, res, next);
    },
    (req, res) => {
      res.redirect(process.env.POST_AUTH_REDIRECT || '/api-docs');
    }
  );

  router.get('/failure', (req, res) => {
    res.status(401).json({ message: 'Authentication failed' });
  });

  router.get(
    '/logout',
    /* 
      #swagger.tags = ['Auth']
      #swagger.summary = 'End session'
    */
    (req, res, next) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      req.session.destroy(() => {
        res.status(200).json({ message: 'Logged out' });
      });
    });
    }
  );

  router.get(
    '/me',
    /* 
      #swagger.tags = ['Auth']
      #swagger.summary = 'Get current authenticated user'
    */
    (req, res) => {
    if (req.isAuthenticated && req.isAuthenticated()) {
      return res.status(200).json({ user: req.user });
    }
    return res.status(401).json({ message: 'Not authenticated' });
    }
  );

  return router;
};

module.exports = buildAuthRouter;
