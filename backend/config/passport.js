const GoogleStrategy = require('passport-google-oauth20').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const { query } = require('./database');

module.exports = function(passport) {
  // Google OAuth Strategy
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user already exists with this Google ID
      let result = await query(
        'SELECT * FROM users WHERE google_id = $1',
        [profile.id]
      );

      if (result.rows.length > 0) {
        // User exists, return user
        return done(null, result.rows[0]);
      }

      // Check if user exists with same email
      result = await query(
        'SELECT * FROM users WHERE email = $1',
        [profile.emails[0].value]
      );

      if (result.rows.length > 0) {
        // Update existing user with Google ID
        const updatedUser = await query(
          'UPDATE users SET google_id = $1, profile_picture = $2 WHERE email = $3 RETURNING *',
          [profile.id, profile.photos[0].value, profile.emails[0].value]
        );
        return done(null, updatedUser.rows[0]);
      }

      // Create new user
      const newUser = await query(
        `INSERT INTO users (google_id, email, name, profile_picture) 
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [
          profile.id,
          profile.emails[0].value,
          profile.displayName,
          profile.photos[0].value
        ]
      );

      return done(null, newUser.rows[0]);
    } catch (error) {
      console.error('Google OAuth error:', error);
      return done(error, null);
    }
  }));

  // JWT Strategy for API authentication
  passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET || 'ergiva-jwt-secret'
  },
  async (payload, done) => {
    try {
      const result = await query(
        'SELECT * FROM users WHERE id = $1',
        [payload.id]
      );

      if (result.rows.length > 0) {
        return done(null, result.rows[0]);
      }

      return done(null, false);
    } catch (error) {
      console.error('JWT Strategy error:', error);
      return done(error, false);
    }
  }));

  // Serialize user for session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Deserialize user from session
  passport.deserializeUser(async (id, done) => {
    try {
      const result = await query(
        'SELECT * FROM users WHERE id = $1',
        [id]
      );

      if (result.rows.length > 0) {
        done(null, result.rows[0]);
      } else {
        done(null, false);
      }
    } catch (error) {
      console.error('Deserialize user error:', error);
      done(error, false);
    }
  });
};