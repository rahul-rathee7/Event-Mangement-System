import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { checkCookie, loginUser, logoutUser, registerUser } from '../controllers/Auth.js';

const router = express.Router();

router.get('/get-cookie', checkCookie);
router.post('/login', loginUser);
router.post('/register', registerUser);
router.get('/logout', logoutUser);

// Google OAuth Routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: 'http://localhost:3000/userAuth/login', session: false }),
  (req, res) => {
    const user = req.user;
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'your_jwt_secret', {
      expiresIn: '1h',
    });

    res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 3600000
    });

    res.redirect('http://localhost:3000/');
  }
);

export default router;