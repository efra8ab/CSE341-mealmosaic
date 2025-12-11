const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/user');

let oauthConfigured = false;

const configurePassport = (passportInstance) => {
  const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, GITHUB_CALLBACK_URL } = process.env;

  passportInstance.serializeUser((user, done) => {
    done(null, user.id);
  });

  passportInstance.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET || !GITHUB_CALLBACK_URL) {
    console.warn('⚠️ GitHub OAuth is not configured. Set GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, and GITHUB_CALLBACK_URL.');
    oauthConfigured = false;
    return;
  }

  oauthConfigured = true;

  passportInstance.use(
    new GitHubStrategy(
      {
        clientID: GITHUB_CLIENT_ID,
        clientSecret: GITHUB_CLIENT_SECRET,
        callbackURL: GITHUB_CALLBACK_URL,
        scope: ['read:user', 'user:email'],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails && profile.emails.length ? profile.emails[0].value : undefined;
          const update = {
            username: profile.username || profile.displayName || profile.id,
            email: email || `${profile.username || profile.id}@users.noreply.github.com`,
            avatarUrl: profile.photos && profile.photos.length ? profile.photos[0].value : undefined,
            githubId: profile.id,
          };

          const user = await User.findOneAndUpdate({ githubId: profile.id }, update, {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true,
          });

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

};

const isOAuthConfigured = () => oauthConfigured;

module.exports = { configurePassport, isOAuthConfigured };
