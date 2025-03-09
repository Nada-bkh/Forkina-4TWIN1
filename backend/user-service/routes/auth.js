import {Router} from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import {jwtConfig} from "../config/authConfig.js";
import passport from "../config/passport.js";


dotenv.config()

const router = Router();

const CLIENT_URL = process.env.CLIENT_URL;
const FAILURE_URL = `${CLIENT_URL}/signin`;

// Initial Google authentication
router.get("/google", 
  passport.authenticate("google", { 
    scope: ["profile", "email"],
    prompt: "select_account"
  })
);

// Initial GitHub authentication
router.get("/github",
  passport.authenticate("github", { 
    scope: ["user:email"],
    allow_signup: true
  })
);

// Google auth callback
router.get(
  "/google/callback",
  (req, res, next) => {
    passport.authenticate("google", { session: true }, async (err, user, _) => {
      if (err) {
        console.error('Authentication error:', err);
        return res.redirect(FAILURE_URL);
      }

      if (!user) {
        console.error('No user found/created');
        return res.redirect(FAILURE_URL);
      }

      try {
        // Generate token with consistent field names
        const token = jwt.sign(
          {
            id: user._id.toString(),
            email: user.email,
            role: user.userRole 
          },
            jwtConfig.jwtSecret,
          { expiresIn: jwtConfig.jwtExpiration }
        );

        // Set token in cookie
        res.cookie('auth_token', token, {
          httpOnly: false, // Allow JavaScript access
          secure: true,
          sameSite: 'lax',
          maxAge: jwtConfig.jwtExpirationInMs // 7 days
        });

        // Redirect to a transfer page
        res.redirect(`${CLIENT_URL}/auth-transfer`);
      } catch (error) {
        console.error('Token/login error:', error);
        return res.redirect(FAILURE_URL);
      }
    })(req, res, next);
  }
);

// GitHub auth callback
router.get("/github/callback",
  (req, res, next) => {
    passport.authenticate("github", { session: true }, async (err, user, _) => {
      if (err) {
        console.error('GitHub Authentication error:', err);
        return res.redirect(FAILURE_URL);
      }

      if (!user) {
        console.error('No GitHub user found/created');
        return res.redirect(FAILURE_URL);
      }

      try {
        // Generate token with consistent field names
        const token = jwt.sign(
          { 
            id: user._id.toString(),
            email: user.email,
            role: user.userRole 
          },
          process.env.JWT_SECRET,
          { expiresIn: jwtConfig.jwtExpiration }
        );

        // Set token in cookie
        res.cookie('auth_token', token, {
          httpOnly: false,
          secure: true,
          sameSite: 'lax',
          maxAge: jwtConfig.jwtExpirationInMs
        });

        // Log the user in
        await req.login(user, (err) => {
          if (err) {
            console.error('Login error:', err);
            return res.redirect(FAILURE_URL);
          }
          res.redirect(`${CLIENT_URL}/auth-transfer`);
        });
      } catch (error) {
        console.error('Token/login error:', error);
        return res.redirect(FAILURE_URL);
      }
    })(req, res, next);
  }
);

// Check authentication status
router.get("/login/success", (req, res) => {
  if (req.user) {
    res.status(200).json({
      success: true,
      message: "Login successful",
      user: req.user,
    });
  } else {
    res.status(403).json({ success: false, message: "Not authorized" });
  }
});

router.get("/login/failed", (req, res) => {
  res.status(401).json({
    success: false,
    message: "Login failed",
  });
});

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Logout error:', err);
    }
    res.clearCookie('token');
    res.redirect(CLIENT_URL);
  });
});

export default router