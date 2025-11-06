import express from 'express'
import { checkCookie, loginUser, logoutUser, registerUser } from '../controllers/Auth.js'

const router = express.Router()

router.get('/get-cookie', checkCookie);
router.post('/login', loginUser);
router.post('/register', registerUser);
router.get('/logout', logoutUser);

export default router;