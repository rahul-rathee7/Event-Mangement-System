import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { checkCookie, loginUser, logoutUser, registerUser } from '../controllers/Auth.js';

const router = express.Router();

// Existing Routes
router.get('/get-cookie', checkCookie);
router.post('/login', loginUser);
router.post('/register', registerUser);
router.get('/logout', logoutUser);

// Google OAuth Routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: 'http://localhost:3000/userAuth/login', session: false }),
  (req, res) => {
    // Successful authentication
    const user = req.user;
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'your_jwt_secret', {
      expiresIn: '1h',
    });

    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'development' ? false : true, // Use secure cookies in production
        sameSite: 'strict',
        maxAge: 3600000 // 1 hour
    });

    res.redirect('http://localhost:3000/');
  }
);

export default router;