import express from 'express';
import passport from 'passport';
import { checkCookie, loginUser, logoutUser, registerUser, createToken } from '../controllers/Auth.js';

const router = express.Router();

router.get('/get-cookie', checkCookie);
router.post('/login', loginUser);
router.post('/register', registerUser);
router.get('/logout', logoutUser);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: 'https://event-mangement-system-one.vercel.app/userAuth/login', session: false }),
  (req, res) => {
    const user = req.user;
    const token = createToken(user);

    res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 3600000 * 24 * 7 // 7 days
    });

    res.redirect('https://event-mangement-system-one.vercel.app/');
  }
);

export default router;