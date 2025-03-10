import {Strategy as GoogleStrategy} from "passport-google-oauth20";
import {Strategy as GitHubStrategy} from "passport-github2";
import passport from "passport";
import User from "../models/userModel.js";
import dotenv from "dotenv";

dotenv.config()

const BACKEND_URL = `http://localhost:${process.env.PORT}`;

const GOOGLE_CONFIG = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${BACKEND_URL}/auth/google/callback`,
  scope: ["profile", "email"]
};

const GITHUB_CONFIG = {
  clientID: process.env.API_GITHUB_CLIENT_ID,
  clientSecret: process.env.API_GITHUB_CLIENT_SECRET,
  callbackURL: process.env.API_GITHUB_CALLBACK_URL,
  scope: ["user:email"],
  authorizationURL: "https://github.com/login/oauth/authorize",
  passReqToCallback: true,
  state: true
};

// Debug environment variables
console.log('Passport Config:', {
  GOOGLE_CLIENT_ID: GOOGLE_CONFIG.clientID,
  GITHUB_CLIENT_ID: GITHUB_CONFIG.clientID,
  callbackURL: GOOGLE_CONFIG.callbackURL,
  githubCallbackURL: GITHUB_CONFIG.callbackURL,
  CLIENT_URL: process.env.CLIENT_URL
});

// Check for required environment variables
if (!GOOGLE_CONFIG.clientID || !GOOGLE_CONFIG.clientSecret) {
  console.error('Missing required Google OAuth credentials in environment variables');
  process.exit(1);
}

// Google Strategy
passport.use(
  new GoogleStrategy(GOOGLE_CONFIG, async function (accessToken, refreshToken, profile, done) {
    try {
      console.log('Google Profile:', {
        id: profile.id,
        displayName: profile.displayName,
        email: profile.emails?.[0]?.value,
        firstName: profile.name?.givenName,
        lastName: profile.name?.familyName
      });

      // Check if the user already exists by email
      let user = await User.findOne({ email: profile.emails[0].value });
      console.log('Existing user:', user);

      if (user) {
        // If user exists but does not have Google ID, update it
        if (!user.googleId) {
          user.googleId = profile.id;
          await user.save();
        }
        return done(null, user);
      }

      // If no user exists, create a new one
      const userData = {
        googleId: profile.id,
        firstName: profile.name?.givenName || profile.displayName.split(' ')[0],
        lastName: profile.name?.familyName || profile.displayName.split(' ')[1] || '',
        email: profile.emails[0].value,
        avatar: profile.photos?.[0]?.value,
        isGoogleUser: true
      };

      console.log('Creating new user with data:', userData);
      user = await User.create(userData);
      console.log('New user created:', user);

      return done(null, user);
    } catch (error) {
      console.error('Error in Google Strategy:', error);
      return done(error, null);
    }
  })
);


// GitHub Strategy
passport.use(
  new GitHubStrategy(GITHUB_CONFIG, async function(request, accessToken, refreshToken, profile, done) {
    try {
      if (!profile) {
        return done(new Error("No profile received from GitHub"), null);
      }

      console.log('GitHub Profile:', {
        id: profile.id,
        displayName: profile.displayName,
        username: profile.username,
        email: profile.emails?.[0]?.value,
        avatar: profile.photos?.[0]?.value
      });

      let user = await User.findOne({ githubId: profile.id });
      console.log('Existing user:', user);

      if (!user) {
        const firstName = profile.displayName ? profile.displayName.split(' ')[0] : profile.username;
        const lastName = profile.displayName ? profile.displayName.split(' ').slice(1).join(' ') : 'User';

        const userData = {
          githubId: profile.id,
          firstName: firstName,
          lastName: lastName || 'User',
          email: profile.emails?.[0]?.value || `${profile.username}@github.com`,
          avatar: profile.photos?.[0]?.value,
          isGithubUser: true
        };
        console.log('Creating new user with data:', userData);
        
        user = await User.create(userData);
        console.log('New user created:', user);
      }

      return done(null, user);
    } catch (error) {
      console.error('Error in GitHub Strategy:', error);
      return done(error, null);
    }
  })
);

passport.serializeUser((user, done) => {
  console.log('Serializing user:', user.id);
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    console.log('Deserializing user:', id);
    const user = await User.findById(id);
    console.log('Deserialized user found:', user ? 'yes' : 'no');
    done(null, user);
  } catch (error) {
    console.error('Deserialize error:', error);
    done(error, null);
  }
});

export default passport;
